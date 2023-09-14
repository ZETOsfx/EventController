require('dotenv').config();

const db = require('../../config/dbConfig');

const event_type = ['image', 'form', 'video'];

let datek;

function GetDate() {
    let date_ob = new Date();
    let dd = ("0" + date_ob.getDate()).slice(-2);
    let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let yyyy = date_ob.getFullYear();

    if (((Number(mm) % 2 === 1 && Number(mm) <= 7) || (Number(mm) > 7 && Number(mm) % 2 === 0)) && Number(dd) > 28) {
        if (Number(mm) + 1 < 10)
            datek = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
        else
            datek = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
    } else if ((Number(mm) === 4 || Number(mm) === 6 || Number(mm) === 9 || Number(mm) === 11) && Number(dd) > 27) {
        if (Number(mm) + 1 < 10)
            datek = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
        else
            datek = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
    } else if (Number(mm) === 2 && Number(dd) > 25) {
        if (Number(mm) + 1 < 10)
            datek = yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
        else
            datek = yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
    } else {
        if (Number(dd) + 3 < 10)
            datek = yyyy + '-' + mm + '-0' + (Number(dd) + 3);
        else
            datek = yyyy + '-' + mm + '-' + (Number(dd) + 3);
    }
}

class EditorService {

    /**
     * @method '/compose'
     * @param { * }         req
     * @param { name }      req  NAME for new compose
     * @param { screen }    req  TARGET SCREEN for new compose
     * @param { isSpec }    req  TYPE of new compose
     * @param { comment }   req  COMMENT (for descriptions)
     * @param { programs }  req  list of TEMPLATES included new compose
     * @param { times }     req  list of TIMINGS from template
     * @param { * }         res  op. status + new list with composes / message for client
     */
    async createCompose(req, res) {

        if (!['admin', 'moder', 'editor'].includes(req.user.role))
            return res.redirect('/404');

        const {name, screen, isSpec = false} = req?.body;
        let {comment, programs, times} = req?.body;

        // PROGRAMS и TIMES - сопоставленные по индексам списки (соответственно по имени и времени переключения)
        // Для стандартного шаблона TIMES может быть пустым. 

        if (comment === undefined)
            comment = '';

        const req_here = await db('composed').select('id').where({name}).where('author', req.user.name);

        if (req_here[0] !== undefined)
            return res.status(200).json({message: 'Программа с таким заголовком уже существует. Для однозначной идентификации придумайте другой.'});

        let date_ob = new Date();
        let dd = ("0" + date_ob.getDate()).slice(-2);
        let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let yyyy = date_ob.getFullYear();
        let targetDate = yyyy + '-' + mm + '-' + dd;

        if (isSpec) {
            // PROGRAMS [N], где N - число пользователя. Структура такая же, как и ранее, 
            // но в добавок содержит кастомное время установки, таким же образом задаваемое
            // главным источником нестабильной работы в системе.
            if (!(name && programs.length !== 0 && screen))
                return res.status(200).json({message: 'Некорректные параметры шаблона специального типа. Проверьте правильность заполения полей в форме отправки.'});

            const request = await db('composed').insert({
                name: name,                         // Заголовок запроса на модерацию
                comment: comment,                   // Комментарий редактора для модератора
                date: targetDate,                   // Дата, на которую хочет поставить редактор
                isspecial: true,                    // Метка специального расписания
                author: req.user.name,              // Автор запроса на установку
                screen: screen,                     // Экран, на который необходимо установить трансляцию
            }).returning('*');
            // Обрабатываем все шаблоны, включенные в список на особое расписание
            for (let index in programs) {
                const specTemp = await db('tmp').select('*').where('name', programs[index]);
                const eventsTemp = await db('events_tmp').select('*').where('tmpid', specTemp[0].id);

                delete specTemp[0].id;
                specTemp[0].from = request[0].id;
                specTemp[0].time_to_swap = times[index];
                const newTmp = await db('tmp_cmp').insert(specTemp[0]).returning('*');
                for (let i in eventsTemp) {
                    delete eventsTemp[i].id;
                    eventsTemp[i].tmpid = newTmp[0].id;
                    await db('events_tmp_cmp').insert(eventsTemp[i]);
                }
            }

            const sptmp = await db('tmp_cmp').select('*').where('from', request[0].id).orderBy('time_to_swap');

            for (let i in sptmp)
                sptmp[i].time_to_swap = sptmp[i].time_to_swap.substring(0, 5);

            return res.status(200).json({message: '-', cmp: request, spec: sptmp});
        } else {
            // PROGRAMS
            // [0] - имя шаблона на пары
            // [1] - имя шаблона на перерыв
            // [2] - имя шаблона на обед 
            if (!(name && (programs[0] !== '-' || programs[1] !== '-' || programs[2] !== '-') && screen))
                return res.status(200).json({message: 'Некорректные параметры шаблона стандартного типа. Проверьте правильность заполнения полей в форме отправки.'});

            let originTemp = [];
            let active;

            if (programs[0] !== '-') {
                const stud_tmp = await db('tmp').select('*').where('name', programs[0]);
                originTemp.push(stud_tmp[0]);
            } else {
                // если оставлять без изменений, подстановка будет происходить из активной трансляции
                active = await db('events_req_form').select('*').where('isActive', true);
                if (!active[0])
                    return res.status(200).json({message: 'Нет активных шаблонов. Поля не могут быть пустыми.'});

                if (active[0].lesson !== '-') {
                    const stud_tmp = await db('tmp').select('*').where('name', active[0].lesson);
                    programs[0] = active[0].lesson;
                    originTemp.push(stud_tmp[0]);
                } else
                    return res.status(200).json({message: 'В активном шаблоне отсутствует программа на ПАРЫ.\nПожалуйста, заполните данное поле.'});
            }

            if (programs[1] !== '-') {
                // Если в одном запросе стоит несколько одинаковых шаблонов, не нужно дублировать резервные копии
                if (programs[1] !== programs[0]) {
                    const break_tmp = await db('tmp').select('*').where('name', programs[1]);
                    originTemp.push(break_tmp[0]);
                }
            } else {
                active = await db('events_req_form').select('*').where('isActive', true);
                if (!active[0])
                    return res.status(200).json({message: 'Нет активных шаблонов. Поля не могут быть пустыми.'});

                if (active[0].breaktime !== '-') {
                    let break_tmp = await db('tmp').select('*').where('name', active[0].breaktime);
                    programs[1] = active[0].breaktime;
                    originTemp.push(break_tmp[0]);
                } else
                    return res.status(200).json({message: 'В активном шаблоне отсутствует программа на ПЕРЕРЫВ.\nПожалуйста, заполните данное поле.'});
            }

            if (programs[2] !== '-') {
                if (programs[2] !== programs[1] && programs[2] !== programs[0]) {
                    const lunch_tmp = await db('tmp').select('*').where('name', programs[2]);
                    originTemp.push(lunch_tmp[0]);
                }
            } else {
                active = await db('events_req_form').select('*').where('isActive', true);
                if (!active[0])
                    return res.status(200).json({message: 'Нет активных шаблонов. Поля не могут быть пустыми.'});

                if (active[0].lunch !== '-') {
                    let lunch_tmp = await db('tmp').select('*').where('name', active[0].lunch);
                    programs[2] = active[0].lunch;
                    originTemp.push(lunch_tmp[0]);
                } else
                    return res.status(400).json({message: 'В активном шаблоне отсутствует программа на ОБЕД.\nПожалуйста, заполните данное поле.'});
            }
            // Если все окей, вносим скомпанованную программу в хранилище
            const reeq = await db('composed').insert({
                name: name,                         // Заголовок запроса на модерацию
                comment: comment,                   // Комментарий редактора для модератора
                date: targetDate,                   // Дата, на которую хочет поставить редактор
                isspecial: false,                   // Метка специального расписания
                author: req.user.name,              // Автор запроса на установку
                lesson: programs[0],                // Программа трансляции - Время занятий
                breaktime: programs[1],             // Программа трансляции - Время перерыва между занятиями
                lunch: programs[2],                 // Программа трансляции - Время обеда
                screen: screen,                     // Экран, на который необходимо установить трансляцию
            }).returning('*');

            for (let j in originTemp) {
                // Все события указанных при отправке шаблонов
                const eventsTemp = await db('events_tmp').select('*').where('tmpid', originTemp[j].id);
                delete originTemp[j].id;
                originTemp[j].from = reeq[0].id;
                const newTmp = await db('tmp_cmp').insert(originTemp[j]).returning("*");
                for (let i in eventsTemp) {
                    delete eventsTemp[i].id;
                    eventsTemp[i].tmpid = newTmp[0].id;
                    await db('events_tmp_cmp').insert(eventsTemp[i]);
                }
            }
            return res.status(200).json({message: '-', cmp: reeq});
        }
    }

    /**
     * @method '/delcmp'
     * @param { * }        req
     * @param { * }        res
     * @param { id } req  ID of compose needed to delete
     */
    async deleteCompose(req, res) {

        if (!['admin', 'moder', 'editor'].includes(req.user.role))
            return res.redirect('/404');

        const {id} = req?.body;

        const cmp = await db('composed').select('*').where({id});

        if (cmp[0] === undefined)
            return res.status(400).end();

        if (cmp[0].author === req.user.name)
            await db('composed').where({id}).del();

        return res.status(200).end();
    }

    /**
     *  @method '/sendcmp'
     * @param { id }    req  ID od compose needed send
     * @param { name }  req  new name form editor to moder
     * @param { comm }  req  new comment form editor to moder
     * @param { * }     res  callback + message for user
     */
    async sendCompose(req, res) {

        if (!['admin', 'moder', 'editor'].includes(req.user.role))
            return res.redirect('/404');

        const {id, name, comm, date} = req?.body;

        if (!name || name == '')
            return res.status(400).json({cb: 'error', message: 'Нельзя отправить программу с пустым именем!'});

        if (!date)
            return res.status(400).json({
                cb: 'error',
                message: 'Нельзя отправить программу без указания даты установки!'
            });

        const cmp = await db('composed').select('*').where({id});

        if (cmp[0] === undefined)
            return res.status(400).json({
                cb: 'error',
                message: 'Данный шаблон не найден. Пожалуйста, перезагрузите страницу.'
            });

        if (cmp[0].author !== req.user.name)
            return res.status(400).json({
                cb: 'error',
                message: 'Только автор может отправить данную программу на модерацию.'
            });

        const isHere = await db('events_req_form').where('name', name);

        if (isHere[0] !== undefined)
            return res.status(400).json({
                cb: 'error',
                message: 'Программа с данным заголовком уже существует в списках модератора. Пожалуйста, придумайте другое название. '
            });

        const templates = await db('tmp_cmp').select('*').where('from', cmp[0].id);
        // insert request
        cmp[0].isAccepted = false;
        cmp[0].isActive = false;
        cmp[0].inProcessing = false;
        cmp[0].name = name;
        cmp[0].comment = comm;
        cmp[0].date = date;
        delete cmp[0].id;

        const newreq = await db('events_req_form').insert(cmp[0]).returning('*');
        // insert templates

        for (let dex in templates) {
            const events = await db('events_tmp_cmp').select('*').where('tmpid', templates[dex].id);

            delete templates[dex].id;
            templates[dex].from = newreq[0].id;
            const newtmp = await db('tmp_acc').insert(templates[dex]).returning('*');

            for (let i in events) {
                events[i].tmpid = newtmp[0].id;
                delete events[i].id;
                await db('events_tmp_acc').insert(events[i]);
            }
        }

        // Оповещение для редактора об успешной отправке запроса на модерацию
        const callback = 'Ваш запрос под заголовком "' + newreq[0].name + '" был успешно отправлен на модерацию.';
        GetDate();

        // Уведа об успешной отправке
        await db('ads').insert({
            name: "Запрос отправлен",
            comment: callback,
            timeOfLife: datek,
            author: "System",
            translate: "false",
            personal: req.user.name
        });

        return res.status(200).json({
            cb: 'success',
            message: 'Шаблон успешно отправлен на модерацию. Уведомления о его состоянии можно видеть во вкладке "Уведомления".'
        });
    }

    /**
     * @method '/savecmp'
     * @param { * }         req
     * @param { id }        req  ID of compose where have updates
     * @param { tmpList }   req  list of templates
     * @param { date }      req  checking & update if needed change date for cast program
     * @param { eventList } req  list of events having need order
     * @param { timeList }  req  list if timings for eventList also having order
     * @param { * }         res
     * @returns callback + status message for client
     */
    async templateSaveChangesIntoCompose(req, res) {

        if (!['admin', 'moder', 'editor'].includes(req.user.role))
            return res.redirect('/404');

        const {id, date, tmpList, eventList, timeList} = req?.body;
        // Композиция
        const compose = await db('composed').select('*').where({id});
        // Если в изменения вообще что-то прилетело (нет смысла сохранять пустые композиции)
        if (tmpList === undefined)
            return res.status(200).json({
                cb: 'error',
                message: 'Невозможно сохранить пустую композицию. Вы можете добавить хотя бы один шаблон, либо удалить композицию полностью.'
            });

        // 1. Удаляем все шаблоны с событиями, которые ранее заполняли композицию
        await db('tmp_cmp').where('from', compose[0].id).del();
        // Внесение новых данных в специальный тип
        if (compose[0].isspecial === true) {
            // Если шаблон меняет тип, затираем ненужные поля
            await db('composed').where({id}).update({
                date: date,
                lesson: null,
                breaktime: null,
                lunch: null
            });
            // 2. Вносим новые шаблоны внутрь композиции
            for (let i in tmpList) {
                // Подхватываемый шаблон
                let tmp = await db('tmp').select('*').where('name', tmpList[i]);
                // События шаблона
                if (eventList[i] === undefined)
                    eventList[i] = await db('events_tmp').select('*').where('tmpid', tmp[0].id).orderBy('order');
                // Корректировка полей и установка нового шаблона
                delete tmp[0].id;
                tmp[0].from = compose[0].id;
                tmp[0].time_to_swap = timeList[i];
                const newTemplate = await db('tmp_cmp').insert(tmp[0]).returning('*');

                // 3. Заполняем списки событий шаблонов
                for (let j in eventList[i]) {
                    delete eventList[i][j].id;
                    eventList[i][j].order = Number(j) + 1;
                    eventList[i][j].tmpid = newTemplate[0].id;
                    await db('events_tmp_cmp').insert(eventList[i][j]);
                }
            }
            // Внесение новых данных в стандартный тип
        } else {
            await db('composed').where({id}).update({
                date: date,
                lesson: tmpList[0],
                breaktime: tmpList[1],
                lunch: tmpList[2]
            });

            // Прилетели шаблоны без внутренних корректировок
            if (eventList.length === 0) {
                // В таком случае просто копируем данные из хранилища
                for (let i in tmpList) {
                    if (i === 1 && tmpList[1] === tmpList[0])
                        eventList.push('lesson');
                    else if (i === 2 && tmpList[2] === tmpList[1])
                        eventList.push('breaktime');
                    else if (i === 2 && tmpList[2] === tmpList[0])
                        eventList.push('lesson');
                    else {
                        const template = await db('tmp').select('*').where('name', tmpList[i]);
                        const events = await db('events_tmp').select('*').where('tmpid', template[0].id).orderBy('order');
                        eventList.push(events);
                    }
                }
            }

            // 2. Заполнение новыми данными
            for (let i in tmpList) {
                if (typeof eventList[i] === 'string' && i === tmpList.length - 1)
                    // События шаблона в данном ключе подписаны строкой
                    break;  // -> это повтор, его вносит не нужно
                else if (typeof eventList[i] === 'string')
                    continue;
                // Если данный пункт является уникальным шаблоном, выбираем его из хранилища шаблонов
                let template = await db('tmp').select('*').where('name', tmpList[i]);

                delete template[0].id;              // удаляем id, поскольку таблица присвоит ему новый
                template[0].from = compose[0].id;   // указываем принадлежность к текущей композиции
                // В остальном все поля соответствуют структуре хранилища скомпанованных шаблонов
                // -> можно просто внести в хранилище
                const addedTemplate = await db('tmp_cmp').insert(template[0]).returning('*');

                // 3. Заполнение событий уникального шаблона
                for (let j in eventList[i]) {
                    delete eventList[i][j].id;
                    eventList[i][j].order = j + 1;
                    eventList[i][j].tmpid = addedTemplate[0].id;
                    await db('events_tmp_cmp').insert(eventList[i][j]);
                }
            }
        }

        return res.status(200).json({cb: 'success', message: 'Изменения в композиции успешно сохранены.'});
    }

    /**
     * @method '/tmpcmpreserve'
     * @param { * }     req
     * @param { id }    req  ID of compose needs preview
     * @param { name }  req  NAME of template in compose needs preview
     * @param { time }  req  TIME (special) or POSITION (standard) of template in compose needs preview
     * @param { * }     res  EventList for target template needs preview
     */
    async eventsFromTmpInCompose(req, res) {

        if (!['admin', 'moder', 'editor'].includes(req.user.role))
            return res.redirect('/404');

        const {id, name, time} = req?.body;

        let _tmp;
        const _cmp = await db('composed').select('*').where({id});

        if (time === undefined)
            _tmp = await db('tmp_cmp').select('*').where({name}).where('from', _cmp[0].id);
        else
            _tmp = await db('tmp_cmp').select('*').where({name}).where('from', _cmp[0].id).where('time_to_swap', time);

        const events = await db('events_tmp_cmp').select('*').where('tmpid', _tmp[0].id);

        return res.status(200).json(events);
    }

    /**
     * @method '/json'
     * @param { Object } res  object with list of templates
     */
    async getEventsFormatJSON(req, res) {
        res.header('Access-Control-Allow-Origin', '*');

        const events = await db.where('isActive', true)
            .select('*')
            .from('events')
            .orderBy('order');

        let event_json = [];
        let datetime_order = (new Date()).getTime();

        for (let i in events) {
            event_json.push({
                time: new Date(datetime_order),
                type: event_type[events[i].type],
                src: events[i].src
            });
            datetime_order += events[i].time * 1000;
        }

        event_json.push({
            time: new Date(datetime_order),
            type: "end",
            src: "src"
        });

        return res.status(200).json({pages: event_json});
    }
}

module.exports = new EditorService();