require('dotenv').config();
const db    = require('../../config/dbConfig')['migrations'];       // Database connection
const cache = require('../../config/redisConfig');    // Redis connection

// -------------- LOGGING & PATH ----------------
// const mainLogger = require('../../domain/Model/mainLogger');

const Lessons = [ 
    [30000, 31200, 'Перерыв'],  // Перерыв, с 8:20
    [31200, 36900, 'Пара'],     // 1ая пара, с 8:40
    [36900, 37500, 'Перерыв'],  // Перерыв, с 10:15
    [37500, 43200, 'Пара'],     // 2ая пара, с 10:25
    [43200, 46200, 'Обед'],     // Обед, С 12:00
    [46200, 51900, 'Пара'],     // 3ая пара, с 12:50
    [51900, 52500, 'Перерыв'],  // Перерыв, с 14:25
    [52500, 58200, 'Пара'],     // 4ая пара, с 14:35
    [58200, 58800, 'Перерыв'],  // Перерыв, с 16:10
    [58800, 64500, 'Пара'],     // 5ая пара, с 16:20
];

function getState(curSec) {
    for (let i in Lessons)
        if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) 
            return Lessons[i][2];
        // После 17:55 и до 8:20 - Свободное время
    return 'Свободка'; // Играет шаблон "Обед"
}

function WhatTime() {               // Узнать время в секундах с начала дня
    let today = new Date();         // Получить текущее время и вернуть значение в секнудах
    return  (today.getHours() * 60 + today.getMinutes()) * 60 + today.getSeconds();
}

let date;
function GetDate() {
    let date_ob = new Date();
    let dd = ("0" + date_ob.getDate()).slice(-2);
    let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let yyyy = date_ob.getFullYear();

    if (((Number(mm) % 2 === 1 && Number(mm) <= 7) || (Number(mm) > 7 && Number(mm) % 2 === 0)) && Number(dd) > 28) {
        if (Number(mm) + 1 < 10)
            date = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
        else
            date = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
    } else if ((Number(mm) === 4 || Number(mm) === 6 || Number(mm) === 9 || Number(mm) === 11) && Number(dd) > 27) {
        if (Number(mm) + 1 < 10)
            date = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
        else
            date = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
    } else if (Number(mm) === 2 && Number(dd) > 25) {
        if (Number(mm) + 1 < 10)
            date = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
        else
            date = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
    } else {
        if (Number(dd) + 3 < 10)
            date = yyyy + '-' + mm + '-0' + (Number(dd) + 3);
        else
            date = yyyy + '-' + mm + '-' + (Number(dd) + 3);
    }
}

class ModeratorService {
        /**
         * @method '/requests'
         * @param { * } req
         * @param { * } res
         * @returns list with all programs
         */
    async getRequests(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const data = await db('events_req_form').select('*').orderBy('date', 'asc').orderBy('id', 'desc');
        for (let i in data) {
            if (data[i].isspecial === true) {
                data[i].eventList = await db('tmp_acc').select('*').where('from', data[i].id).orderBy('time_to_swap');
                for (let j in data[i].eventList) 
                    data[i].eventList[j].time_to_swap = data[i].eventList[j].time_to_swap.substring(0, 5);
            }
        }

        return res.status(200).json(data);
    }

        /**
         * @method '/alltmp'
         * @param { name }    req  name of program in Processing
         * @param { * }       req
         * @param { * }       res
         * @returns list of templates for moder to replace
         */
    async getTemplates(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { name } = req.body;
        const _req = await db('events_req_form').select('*').where({ name });

        const all = await db('tmp').select('*').where('author', req.user.name).where('isprivate', true);
        const orig = await db('tmp_acc').select('*').where('from', _req[0].id);

        let nameList = [];
        for (let i in all) 
            nameList.push(all[i].name);
        for (let i in orig) 
            nameList.push(orig[i].name);
        
        let unique = nameList.filter((value, index, array) => array.indexOf(value) === index);
        let events = all.concat(orig);
        let eventsList = [];
        
        for (let i in unique) {
            for (let j in events) {
                if (events[j].name === unique[i]) {
                    eventsList.push(events[j]);
                    break;
                }
            }
        }

        return res.status(200).json(eventsList);
    }

       /**
        * @method '/switchprocess'
        * @param { * }    req  name of program in Processing
        * @param { * }    res
        * @returns object: to editing program
        */
    async switchProcess(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { name } = req.body;
        const request = await db('events_req_form').where({ name }).select('inProcessing');
        const reeq = await db('events_req_form').where({ name }).update({
            inProcessing: !request[0].inProcessing,
            whoAccept: req.user.name
        }).returning('whoAccept');

        return res.json(reeq[0]);
    }
    
        /**
         * @method '/access'
         * @param { * }           req
         * @param { obj_req }     req  object of edited program (Object)
         * @param { comment }     req  description from moder (text)
         * @param { has_changes } req  result state includes changes (true/false)
         * @param { upd_less }    req  new data where has changes (Array) in lesson
         * @param { upd_break }   req  new data where has changes (Array) in breaktime
         * @param { upd_lunch }   req  new data where has changes (Array) in lunch
         * @param { Object }      res
         * @returns callback message
         */
    async Access(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

            // ОБЩИЕ ПАРАМЕТРЫ
        const { obj_req, comment, has_changes } = req?.body;

        // ОБЩИЕ ПРОВЕРКИ ВАЛИДНОСТИ
        const date_check = await db('events_req_form').select('*')
            .where('date', obj_req.date)
            .where('isAccepted', true)
            .where('isActive', false);

        if (date_check[0])
            return res.status(400).json({ message: 'errdate' });

        if (!obj_req.name)
            return res.status(400).json({
                message: 'Некорректный параметр. Скорее всего, вы сделали это намеренно. Все действия логгируются :)'
            });

        const request = await db('events_req_form').select('*').where('name', obj_req.name);

        if (!(request !== undefined && request[0].inProcessing && request[0].whoAccept === req.user.name))
            return res.status(400).json({ message: 'Ошибка! Программа не обнаружена.'});

        // ОБНОВЛЕНИЕ ПАРАМЕТРОВ ОБЩЕГО ТИПА (обновление для всех)
        await db('events_req_form').where('name', obj_req.name).update({
            inProcessing: false,
            date: obj_req.date,
            isAccepted: true
        });

            // ЖООООСКИЙ ПРОЦЕССИИИИНГ !!!!
        if (!obj_req.isspecial) {

            // ПАРАМЕТРЫ ТОЛЬКО ДЛЯ СТАНДАРТНОГО ТИПА
            const { upd_less, upd_break, upd_lunch } = req?.body;

            // Список шаблонов (начальный и прилетевший) : на случай если есть изменения
            const pre_example = [request[0].lesson, request[0].breaktime, request[0].lunch];
            const pre_updated = [obj_req.lesson, obj_req.breaktime, obj_req.lunch];
            // Отбор уникальных шаблонов для избежания дублирования
            const example = pre_example
                .filter((value, index, array) => array.indexOf(value) === index);
            const updated = pre_updated
                .filter((value, index, array) => array.indexOf(value) === index);

            // Обновление параметров запроса
            await db('events_req_form').where('name', obj_req.name).update({
                lesson: obj_req.lesson,
                breaktime: obj_req.breaktime,
                lunch: obj_req.lunch
            });

            // Создание новой резервной копии для каждого нового шаблона в запросе
            let isNew = true;
            for (let i in updated) {
                for (let j in example) {
                    if (updated[i] !== example[j]) continue;
                    isNew = false;
                }
                // Если шаблон новый, необходима его резервная копия
                if (!isNew) continue;

                const template = await db('tmp').select('*').where('name', updated[i]);
                const eventsTemp = await db('events_tmp').select('*').where('tmpid', template[0].id);

                delete template[0].id;
                template[0].from = request[0].id;

                const newTmp = await db('tmp_acc').insert(template[0]).returning("*");

                for (let i in eventsTemp) {
                    delete eventsTemp[i].id;
                    eventsTemp[i].tmpid = newTmp[0].id;
                    await db('events_tmp_acc').insert(eventsTemp[i]);
                }

                isNew = true;
            }

            // Очистка замененных шаблонов из хранилища
            let newerUsed = true;
            for (let i in example) {
                for (let j in updated)
                    if (updated[j] === example[i])
                        newerUsed = false;

                if (newerUsed)
                    await db('tmp_acc').where('name', example[i])
                        .where('from', request[0].id).del();

                if (obj_req.isspecial)
                    break;

                newerUsed = true;
            }

            // Если прилетают детальные изменения (для Утверждения или Применения изменений)
            if (has_changes !== undefined) {
                const last = await db('tmp_acc').select('*')
                    .where('name', obj_req.lesson)
                    .where('from', request[0].id);

                await db('events_tmp_acc').where('tmpid', last[0].id).del();

                for (let i in upd_less) {
                    delete upd_less[i].id;
                    upd_less[i].order = i + 1;
                    upd_less[i].tmpid = last[0].id;
                    await db('events_tmp_acc').insert(upd_less[i]);
                }

                if (obj_req.breaktime !== obj_req.lesson) {
                    const lasty = await db('tmp_acc').select('*')
                        .where('name', obj_req.breaktime).where('from', request[0].id);

                    await db('events_tmp_acc').where('tmpid', lasty[0].id).del();

                    for (let i in upd_break) {
                        delete upd_break[i].id;
                        upd_break[i].order = i + 1;
                        upd_break[i].tmpid = lasty[0].id;
                        await db('events_tmp_acc').insert(upd_break[i]);
                    }
                }

                if (obj_req.lunch !== obj_req.lesson && obj_req.lunch !== obj_req.breaktime) {
                    const lastyk = await db('tmp_acc').select('*')
                        .where('name', obj_req.lunch).where('from', request[0].id);

                    await db('events_tmp_acc').where('tmpid', lastyk[0].id).del();

                    for (let i in upd_lunch) {
                        delete upd_lunch[i].id;
                        upd_lunch[i].order = i + 1;
                        upd_lunch[i].tmpid = lastyk[0].id;
                        await db('events_tmp_acc').insert(upd_lunch[i]);
                    }
                }
            }

            // Если редактируется активное отображение, то при необходимости вносим изменения сразу на трансляцию
            if (request[0].isActive) {
                await db('events').truncate();

                switch (getState(WhatTime())) {
                    case 'Перерыв':
                        const prog_br = await db('tmp_acc').select('*')
                            .where('name', request[0].breaktime).where('from', request[0].id);

                        const events_br = await db('events_tmp_acc').select('*')
                            .where('tmpid', prog_br[0].id).orderBy('order');

                        for (let i in events_br) {
                            delete events_br[i].id;
                            delete events_br[i].tmpid;
                            await db('events').insert(events_br[i]);
                        }
                        break;

                    case 'Пара':
                        const prog_le = await db('tmp_acc').select('*')
                            .where('name', request[0].lesson).where('from', request[0].id);

                        const events_le = await db('events_tmp_acc').select('*')
                            .where('tmpid', prog_le[0].id).orderBy('order');

                        for (let i in events_le) {
                            delete events_le[i].id;
                            delete events_le[i].tmpid;
                            await db('events').insert(events_le[i]);
                        }
                        break;

                    case 'Обед':
                    default:
                        const prog_lu = await db('tmp_acc').select('*')
                            .where('name', request[0].lunch).where('from', request[0].id);

                        const events_lu = await db('events_tmp_acc').select('*')
                            .where('tmpid', prog_lu[0].id).orderBy('order');

                        for (let i in events_lu) {
                            delete events_lu[i].id;
                            delete events_lu[i].tmpid;
                            await db('events').insert(events_lu[i]);
                        }
                }

                // Включить стандартные
                await db('job').withSchema('cron').where('jobid', '<', 11).update({
                    active: true
                });

                // Убрать все задачи в CRONTAB где ID > 13
                await db('job').withSchema('cron').where('jobid', '>', 13).del();
            }

        } else {

            // ПАРАМЕТРЫ ТОЛЬКО ДЛЯ ОСОБОГО
            const { upd_tmp_list } = req?.body;

            // Если прилетают детальные изменения (для Утверждения или Применения изменений)
            if (has_changes === true) {
                // Обновление параметров запроса
                await db('tmp_acc').where('from', request[0].id).del();

                for (let i in upd_tmp_list) {
                    let tmp_gen = await db('tmp_acc').insert({
                        name: upd_tmp_list[i].name,
                        author: upd_tmp_list[i].author,
                        isprivate: upd_tmp_list[i].isprivate,
                        canview: upd_tmp_list[i].canview,
                        last_modify: upd_tmp_list[i].last_modify,
                        from: request[0].id,
                        time_to_swap: upd_tmp_list[i].time_to_swap
                    }).returning('*');

                    for (let j in upd_tmp_list[i].events) 
                        console.log(upd_tmp_list[i].events)

                    for (let j in upd_tmp_list[i].events) {
                        delete upd_tmp_list[i].events[j].id;
                        upd_tmp_list[i].events[j].tmpid = tmp_gen[0].id;
                        await db('events_tmp_acc').insert(upd_tmp_list[i].events[j]);
                    }
                }
            }

                // Если редактируется активное отображение, то при необходимости вносим изменения сразу на трансляцию
            if (request[0].isActive) {
                await db('events').truncate();

                const prog_list = await db('tmp_acc').select('*').where('from', request[0].id).orderBy('time_to_swap');
                const date = new Date();
                let curTmp, curTime = date.getHours() + ':' + date.getHours() + ':00', minmax = '00:00:00';

                await db('job').withSchema('cron').where('jobid', '>', 13).del();

                for (let i in prog_list) {
                    if (curTime > prog_list[i].time_to_swap && prog_list[i].time_to_swap > minmax) {
                        minmax = prog_list[i].time_to_swap;
                        curTmp = i;
                    }

                    await db('job').withSchema('cron').insert({
                        schedule: prog_list[i].time_to_swap[3].toString() + prog_list[i].time_to_swap[4].toString() + ' ' + prog_list[i].time_to_swap[0].toString() + prog_list[i].time_to_swap[1].toString() + ' * * *',
                        command: 'DO $$ BEGIN TRUNCATE public.events; INSERT INTO public.events SELECT "name", "src", "isActive", "type", "time", "order" FROM public.events_tmp_acc WHERE "isActive" = true AND "tmpid" = ' + prog_list[i].id + ' ORDER BY "order"; END $$',
                        nodename: ''
                    });
                }

                const events = await db('events_tmp_acc').where('tmpid', prog_list[curTmp].id).orderBy('order');
                for (let i in events) {
                    delete events[i].id;
                    delete events[i].tmpid;

                    await db('events').insert( events[i] );
                }

                // Отключить стандартные
                await db('job').withSchema('cron').where('jobid', '<', 11).update({
                    active: false
                });
            }
        }


            // Поимка "Утверждения" - оповещение автора об утверждении шаблона
        if (!request[0].isAccepted) {
         
            const callback = 'Модератор "' + req.user.name + '" утвердил ваш запрос "'
                + request[0].name + '". \nКомментарий модератора: ' + comment;

            GetDate();
                // Оповестить автора запроса об отклонении (только при подписке ?)
            await db('ads').insert({
                name: "Запрос утвержден",
                comment: callback,
                timeOfLife: date,
                author: "System",
                translate: "false",
                personal: req.user.name
            });
        }

        return res.status(200).json({ message: 'Запрос успешно утвержден.' });
    }

        /**
         * @method '/deny'
         * @param { * }       req
         * @param { name }    req  name of edited request
         * @param { comment } req  comment from moder to editor
         * @param { * }       res
         * @returns callback & info message
         */
    async Deny(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { name, comment } = req.body;

        if (!name) 
            return res.redirect('/404');

        const request = await db('events_req_form').select('id', 'name','whoAccept', 'isAccepted', 'inProcessing', 'lesson', 'breaktime', 'lunch', 'author').where({ name });
        if (!(request !== undefined && request[0].inProcessing && request[0].whoAccept === req.user.name)) 
            return res.redirect('/404');

            // Удаляем запись из головной таблицы (остальное удалится каскадно)
        await db('events_req_form').select('*').where({ name }).del();

        const author = await db('ec_user').select('*').where('name', request[0].author);
        if (!request[0].isAccepted && author[0] !== undefined) {
            const callback = 'Модератор "' + req.user.name + '" отклонил ваш запрос "' + request[0].name + '". \nКомментарий модератора: ' + comment;
            GetDate();
                // Оповестить автора запроса об отклонении (если запрос отклоняется)
            await db('ads').insert({
                name: "Запрос отклонён",
                comment: callback,
                timeOfLife: date,
                author: "System",
                translate: "false",
                personal: request[0].author
            });
        }
    
        return res.end();
    }

        /**
         * --- Except open corrections in CRONTAB table --- 
         * - CRONTAB -> NPM CRON ?
         * @method '/details'
         * @param { * }       req
         * @param { id }      req  edited request ID
         * @param { tmpList } req  empty or full (with changes or else)
         * @param { Object }  res
         * @returns data (lists) from request
         */
    async Details(req, res) {

        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { id, tmpList } = req?.body;
        const _req = await db('events_req_form').select('*').where({ id });

            // special template
        if (_req[0].isspecial === true) {
            const templates = tmpList;
            let data = [];
            
            for (let i in templates) {
                if (templates[i].from !== undefined) {
                        // Имеющийся в хранилище
                    templates[i].events = await db('events_tmp_acc').select('*').where('tmpid', templates[i].id);
                    data.push(templates[i]);
                } else {
                        // Добавленный при редактировании
                    templates[i].events = await db('events_tmp').select('*').where('tmpid', templates[i].id);
                    data.push(templates[i]);
                }
            }

            return res.status(200).json({
                type: _req[0].isspecial,    
                data // [ [ {}, {} ], [ {}, {} ] ]
            });

        } else {
            //  stanrard template [+]
            let copy_tmp_lunch, copy_tmp_lesson, copy_tmp_breaktime;
            let events_lesson = '-', events_breaktime, events_lunch;

                // Находится ли шаблон, который небходимо открыть, в резервной копии?
            const example = [_req[0].lesson, _req[0].breaktime, _req[0].lunch];
            let less_reserve = false, break_reserve = false, lunch_reserve = false;
            for (let i in example) {
                if      (example[i] === tmpList[0])      less_reserve = true;
                else if (example[i] === tmpList[1])      break_reserve = true;
                else if (example[i] === tmpList[2])      lunch_reserve = true;
            }

            if (tmpList[0] !== '-') {
                if (less_reserve) {
                        // Имеющийся в базе
                    console.log(_req[0].id);
                    console.log(tmpList[0]);
                    copy_tmp_lesson = await db('tmp_acc').where('from', _req[0].id).where('name', tmpList[0]).select('*');
                    console.log(copy_tmp_lesson);
                    events_lesson = await db('events_tmp_acc').where('tmpid', copy_tmp_lesson[0].id).select('*').orderBy('order');
                } else {
                        // Выбранный на замену
                    copy_tmp_lesson = await db('tmp').where('name', tmpList[0]).select('*');
                    events_lesson = await db('events_tmp').where('tmpid', copy_tmp_lesson[0].id).select('*').orderBy('order');
                }
            }
                
            if (tmpList[1] !== '-' && tmpList[1] !== tmpList[0]) {
                if (break_reserve) {
                        // Имеющийся в базе
                    copy_tmp_breaktime = await db('tmp_acc').where('from', _req[0].id).where('name', tmpList[1]).select('*');
                    events_breaktime = await db('events_tmp_acc').where('tmpid', copy_tmp_breaktime[0].id).select('*');
                } else {
                        // Выбранный на замену
                    copy_tmp_breaktime = await db('tmp').where('name', obj.breaktime).select('*');
                    events_breaktime = await db('events_tmp').where('tmpid', copy_tmp_breaktime[0].id).select('*');
                }
            } else 
                events_breaktime = 'lesson';
            
            if (tmpList[2] !== '-' && tmpList[2] !== tmpList[1] && tmpList[2] !== tmpList[0]) {
                if (lunch_reserve) {
                        // Имеющийся в базе
                    copy_tmp_lunch = await db('tmp_acc').where('from', _req[0].id).where('name', tmpList[2]).select('*');
                    events_lunch = await db('events_tmp_acc').where('tmpid', copy_tmp_lunch[0].id).select('*');
                } else {
                        // Выбранный на замену
                    copy_tmp_lunch = await db('tmp').where('name', obj.lunch).select('*');
                    events_lunch = await db('events_tmp').where('tmpid', copy_tmp_lunch[0].id).select('*');
                }
            } else {
                if (tmpList[2] === tmpList[0])
                    events_lunch = 'lesson';
                else
                    events_lunch = 'breaktime';
            }

                // Разбиение для стандартного шаблона
            return res.status(200).json({
                type: _req[0].isspecial,
                data: {
                    lesson:     events_lesson,
                    breaktime:  events_breaktime,
                    lunch:      events_lunch
                }
            });
        }
    }

        /**
         * @method '/setactive'
         * @param { * }     req
         * @param { name }  req  name of the request
         * @param { * }     res
         * @returns short callback + message for user
         */ 
    async SetActive(req, res) {
        
        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { name } = req?.body;
            // Нечего делать при отсутствии параметра
        if (!name) return res.redirect('/404');

            // Устанавливаемый шаблон
        const new_req = await db('events_req_form').select('*').where({ name }).where('isAccepted', true);
        
            // Нечего делать, если прилтел некорректный параметр
        if (new_req === undefined) 
            return res.status(400).json({ cb: 'error', message: 'Некорректный параметр.' });
            
            // Затираем активный шаблон (каскадно)
        await db('events_req_form').select('*').where('isActive', true).del().then(() => {
            console.log('Success deleted')
        }).catch((err) => {
            console.log(err);
        });

            // Устанавливаем новый активный шаблон
        await db('events_req_form').where({ name }).where('isAccepted', true).update({ 
            isActive: true
        }).then(() => {
            console.log('Success setted')
        }).catch((err) => {
            console.log(err);
        });

            // Очищаем остатки старого шаблона
        await db('events').truncate().then(() => {
            console.log('Success truncated')
        }).catch((err) => {
            console.log(err);
        });

        if (new_req[0].isspecial) {
            const progs = await db('tmp_acc').select('*').where('from', new_req[0].id).orderBy('time_to_swap');

            const date = new Date();
            let curTmp, curTime = date.getHours() + ':' + date.getHours() + ':00', minmax = '00:00:00';

            await db('job').withSchema('cron').where('jobid', '>', 13).del().then(() => {
                console.log('Success deleted')
            }).catch((err) => {
                console.log(err);
            });

            for (let i in progs) {
                if (curTime > progs[i].time_to_swap) {
                    curTmp = i;
                }

                // --- ОТКРЫТОЕ ВЗАИМОДЕЙСТВИЕ СО СХЕМОЙ ПЛАНИРОВЩИКА (небезопасно - устранить) ---
                    await db('job').withSchema('cron').insert({ 
                        schedule: progs[i].time_to_swap[3].toString() + progs[i].time_to_swap[4].toString() + ' ' + progs[i].time_to_swap[0].toString() + progs[i].time_to_swap[1].toString() + ' * * *',
                        command: 'DO $$ BEGIN TRUNCATE public.events; INSERT INTO public.events SELECT "name", "src", "isActive", "type", "time", "order" FROM public.events_tmp_acc WHERE "isActive" = true AND "tmpid" = ' + progs[i].id + ' ORDER BY "order"; END $$',
                        nodename: ''
                    }).then(() => {
                        console.log('Success jobs inserted')
                    }).catch((err) => {
                        console.log(err);
                    });
                // ------------------------------------------------------------------------------
            }

            if (!curTmp) curTmp = 0;
            
                // События нового актив шаблона 
            const events = await db('events_tmp_acc').select('*').where('tmpid', progs[curTmp].id).orderBy('order');

            for (let i in events) {
                delete events[i].id;
                delete events[i].tmpid;
                await db('events').insert( events[i] ).then(() => {
                    console.log(events[i])
                }).catch((err) => {
                    console.log(err);
                });
            }

            // --- ОТКРЫТОЕ ВЗАИМОДЕЙСТВИЕ СО СХЕМОЙ ПЛАНИРОВЩИКА (небезопасно - устранить) ---
                // Отключить стандартные 
                await db('job').withSchema('cron').where('jobid', '<', 11).update({ 
                    active: false
                });
            // --------------------------------------------------------------------------------

            return res.status(200).json({ cb: 'success', message: 'Все отлично.' });

        } else {
            switch (getState(WhatTime())) {
                case 'Перерыв':
                    const prog_br = await db('tmp_acc').select('*').where('name', new_req[0].breaktime).where('from', new_req[0].id);
                    const events_br = await db('events_tmp_acc').select('*').where('tmpid', prog_br[0].id).orderBy('order');
                    for (let i in events_br) {
                        delete events_br[i].id;
                        delete events_br[i].tmpid;
                        await db('events').insert( events_br[i] );
                    }
                    break;
                case 'Пара':
                    const prog_le = await db('tmp_acc').select('*').where('name', new_req[0].lesson).where('from', new_req[0].id);
                    const events_le = await db('events_tmp_acc').select('*').where('tmpid', prog_le[0].id).orderBy('order');
                    for (let i in events_le) {
                        delete events_le[i].id;
                        delete events_le[i].tmpid;
                        await db('events').insert( events_le[i] );
                    }
                    break;
                case 'Обед':
                default:
                    const prog_lu = await db('tmp_acc').select('*').where('name', new_req[0].lunch).where('from', new_req[0].id);
                    const events_lu = await db('events_tmp_acc').select('*').where('tmpid', prog_lu[0].id).orderBy('order');
                    for (let i in events_lu) {
                        delete events_lu[i].id;
                        delete events_lu[i].tmpid;
                        await db('events').insert(events_lu[i]);
                    }
            } 

            // --- ОТКРЫТОЕ ВЗАИМОДЕЙСТВИЕ СО СХЕМОЙ ПЛАНИРОВЩИКА (небезопасно - устранить) ---
                // Включить стандартные 
                await db('job').withSchema('cron').where('jobid', '<', 11).update({ 
                    active: true
                });

                // Убрать все задачи в CRONTAB где ID > 13
                await db('job').withSchema('cron').where('jobid', '>', 13).del();
            // --------------------------------------------------------------------------------

            return res.status(200).json({ cb: 'success', message: 'Все отлично.' });
        }
    }

        /**
         * @method '/preview'
         * In case where has changes this route cannot be called.
         * @param { * }          req  parameter of list (req -> isAccept = false;
         * @param { from }       req  acc -> isAccept = true; act -> isActive = true)
         * @param { id }         req  parameter from cmp
         * @param { timeOrStep } req  order parameter (time from special & 'lesson / breaktime / lunch' from standard)
         * @param { special }    req  STANDARD (false) or SPECIAL (true)
         * @param { * }          res
         * @returns short callback + list with events + message for user
         */
    async previewData(req, res) {
        if (!['admin', 'moder'].includes(req.user.role))
            return res.redirect('/404');

        const { from, id, timeOrStep, special } = req?.body;

        let eventList, request, tmp;

        switch (from) {
            case 'req': 
                request = await db('events_req_form').select('*').where({ id }).where('isAccepted', false);
                break;
            case 'act':
                request = await db('events_req_form').select('*').where({ id }).where('isAccepted', true).where('isActive', true);
                break;
            case 'acc': 
                request = await db('events_req_form').select('*').where({ id }).where('isAccepted', true).where('isActive', false);
                break;
            default:
                return res.redirect('/404');
        }

        if (request === undefined) 
            return res.json({ cb: 'error', events: [], msg: 'Ошибка! Данного запроса не существует.' });

        if (!special) {
            switch (timeOrStep) {
                case 'lesson':
                    tmp = await db('tmp_acc').select('*').where('from', request[0].id).where('name', request[0].lesson);
                    break;
                case 'breaktime':
                    tmp = await db('tmp_acc').select('*').where('from', request[0].id).where('name', request[0].breaktime);
                    break;
                case 'lunch':
                    tmp = await db('tmp_acc').select('*').where('from', request[0].id).where('name', request[0].lunch);
                    break;
            }
        } else 
            tmp = await db('tmp_acc').select('*').where('from', request[0].id).where('time_to_swap', timeOrStep + ':00');
        
        eventList = await db('events_tmp_acc').select('*').where('tmpid', tmp[0].id);
        return res.status(200).json({ cb: 'success', events: eventList, msg: 'Список событий получен успешно.' });
    }

        /**
         * @method '/endprocess'
         * @param { * }    req
         * @param { name } req  <login> - user's data (closed page without ending processing)
         * @param { * }    res
         * @returns list with events on active cast
         */
    async EndProcess(req, res) {

        const { name } = req?.body;
        
        if (name) 
            await db('events_req_form').where('whoAccept', name).where('inProcessing', true).update({
                inProcessing: false
            });
        
        return res.status(200).end();
    }
}

module.exports = new ModeratorService()