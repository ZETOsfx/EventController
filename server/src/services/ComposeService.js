const { Op } = require("sequelize");
const { Event, Program, Compose } = require('../../models');
const db = require("../../config/dbConfig");

/**
 * Class ProgramService
 * Работа с аккаунтами пользователей
 *
 * @package src/services
 */
class ComposeService
{
    /**
     * Получить события программ внутри композиции (кнопка "Подробнее")
     *
     * - id : идентификатор разворачиваемой композиции
     * - changedTemplates : список ID программ внутри композиции
     *      + Standard type : если внесены изменения (else : null)
     *      + Special type : всегда в установленном порядке
     *
     * @param params Входные GET параметры
     * @return Promise<Object> Списки вложений в композицию
     */
    async getOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { composeId, changedTemplates } = params.body;
        const compose = await Compose.findOne({
            where: {
                id: composeId,
            },
            nested: true,
            raw: true,
        });

        if (compose.isSpecial) {
            const templates = changedTemplates;
            let eventsFromPrograms = [];

            for (let i in templates) {
                templates[i].events = await Event.findAll({
                    where: {
                        programId: templates[i],
                    },
                    order: [
                        [ 'order' ],
                    ],
                    raw: true,
                });
                eventsFromPrograms.push(templates[i]);
            }

            return {
                type: compose.isSpecial,
                data: eventsFromPrograms,
            };

        } else {
            let eventsFromPrograms = {};

            let programIds = {
                lessonId: compose.lesson,
                breaktimeId: compose.breaktime,
                lunchId: compose.lunch,
            };

            if (changedTemplates === null) {
                programIds = {
                    lessonId: changedTemplates[0],
                    breaktimeId: changedTemplates[1],
                    lunchId: changedTemplates[2],
                };
            }

            const lessonProgram = await Program.findOne({
                where: {
                    id: programIds.lessonId,
                },
                raw: true,
            }, {
                fields: [ 'id' ],
            });

            const breakProgram = await Program.findOne({
                where: {
                    id: programIds.breaktimeId,
                },
                raw: true,
            }, {
                fields: [ 'id' ],
            });

            const lunchProgram = await Program.findOne({
                where: {
                    id: programIds.lunchId,
                },
                raw: true,
            }, {
                fields: [ 'id' ],
            });


            eventsFromPrograms.lesson = await Event.findAll({
                where: {
                    programId: lessonProgram.id,
                },
                raw: true,
            });
            eventsFromPrograms.breaktime = await Event.findAll({
                where: {
                    programId: breakProgram.id,
                },
                raw: true,
            });
            eventsFromPrograms.lunch = await Event.findAll({
                where: {
                    programId: lunchProgram.id,
                },
                raw: true,
            });

            return {
                type: compose.isSpecial,
                data: eventsFromPrograms,
            };
        }
    }


    /**
     * Собрать композицию
     *
     * param { * }         req
     * param { name }      req  NAME for new compose
     * param { screen }    req  TARGET SCREEN for new compose
     * param { isSpec }    req  TYPE of new compose
     * param { comment }   req  COMMENT (for descriptions)
     * param { programs }  req  list of TEMPLATES included new compose
     * param { times }     req  list of TIMINGS from template
     * param { * }         res  op. status + new list with composes / message for client
     */
    async addOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { name, screen, programs, times, isSpec = false, comment = '' } = params?.body;

        // PROGRAMS и TIMES - сопоставленные по индексам списки (соответственно по имени и времени переключения)
        // Для стандартного шаблона TIMES может быть пустым.

        if (await this.composeExists(name, user.name)) {
            throw new Error('Программа с таким заголовком уже существует. Для однозначной идентификации придумайте другой');
        }

        let date = new Date();
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let currentDate = year + '-' + month + '-' + day;

        if (isSpec) {
            if (!name || programs.length === 0 || !screen) {
                throw new Error('Композиция должна включать хотя бы одну программу');
            }

            const compose = await Compose.create({
                name: name,
                comment: comment,
                date: currentDate,
                isSpecial: true,
                authorName: user.name,
                screen: screen,
            });

            // ----------- МОЯ ОСТАНОВОЧКА. Тут крч планета остановилась и я сошел. ----------- //

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

            return res.status(200).json({ message: '-', cmp: request, spec: sptmp });
        } else {
            // PROGRAMS
            // [0] - имя шаблона на пары
            // [1] - имя шаблона на перерыв
            // [2] - имя шаблона на обед
            if (!(name && (programs[0] !== '-' || programs[1] !== '-' || programs[2] !== '-') && screen))
                return res.status(200).json({ message: 'Некорректные параметры шаблона стандартного типа. Проверьте правильность заполнения полей в форме отправки.' });

            let originTemp = [];
            let active;

            if (programs[0] !== '-') {
                const stud_tmp = await db('tmp').select('*').where('name', programs[0]);
                originTemp.push(stud_tmp[0]);
            } else {
                // если оставлять без изменений, подстановка будет происходить из активной трансляции
                active = await db('events_req_form').select('*').where('isActive', true);
                if (!active[0])
                    return res.status(200).json({ message: 'Нет активных шаблонов. Поля не могут быть пустыми.' });

                if (active[0].lesson !== '-') {
                    const stud_tmp = await db('tmp').select('*').where('name', active[0].lesson);
                    programs[0] = active[0].lesson;
                    originTemp.push(stud_tmp[0]);
                } else
                    return res.status(200).json({ message: 'В активном шаблоне отсутствует программа на ПАРЫ.\nПожалуйста, заполните данное поле.' });
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
                    return res.status(200).json({ message: 'Нет активных шаблонов. Поля не могут быть пустыми.' });

                if (active[0].breaktime !== '-') {
                    let break_tmp = await db('tmp').select('*').where('name', active[0].breaktime);
                    programs[1] = active[0].breaktime;
                    originTemp.push(break_tmp[0]);
                } else
                    return res.status(200).json({ message: 'В активном шаблоне отсутствует программа на ПЕРЕРЫВ.\nПожалуйста, заполните данное поле.' });
            }

            if (programs[2] !== '-') {
                if (programs[2] !== programs[1] && programs[2] !== programs[0]) {
                    const lunch_tmp = await db('tmp').select('*').where('name', programs[2]);
                    originTemp.push(lunch_tmp[0]);
                }
            } else {
                active = await db('events_req_form').select('*').where('isActive', true);
                if (!active[0])
                    return res.status(200).json({ message: 'Нет активных шаблонов. Поля не могут быть пустыми.' });

                if (active[0].lunch !== '-') {
                    let lunch_tmp = await db('tmp').select('*').where('name', active[0].lunch);
                    programs[2] = active[0].lunch;
                    originTemp.push(lunch_tmp[0]);
                } else
                    return res.status(400).json({ message: 'В активном шаблоне отсутствует программа на ОБЕД.\nПожалуйста, заполните данное поле.' });
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
            return res.status(200).json({ message: '-', cmp: reeq });
        }
    }


    /**
     * Проверка наличия в системе композиции с указанным именем
     *
     * @param composeName Имя композиции, которое необходимо проверить
     * @param username Имя автора композиции
     * @return Promise<boolean> Наличие композиции с подобным именем
     */
    async composeExists(composeName, username)
    {
        const compose = await Compose.findAll({
            where: {
                name: composeName,
                authorName: username,
            },
            raw: true,
        });

        return compose.length > 0;
    }

    /**
     * Проверка наличия доступа к части функционала
     *
     * @param role Роль пользователя в системе
     */
    checkRole(role)
    {
        if (![ 'admin', 'moder', 'editor' ].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }
}

module.exports = new ComposeService();