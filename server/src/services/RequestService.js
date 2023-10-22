const { Sequelize } = require("sequelize");
const { Event, Program, Compose, Request, Note } = require('../../models');

const composeService = require('./ComposeService');

/**
 * Class RequestService
 * Работа с запросами на модерацию
 *
 * @package src/services
 */
class RequestService
{
    /**
     * Получить все существующие запросы в системе
     *
     * @param params Входные GET параметры
     * @return json Список всех запросов в системе
     */
    async getAll(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        return Request.findAll({
            nest: true,
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'programs',
                    model: Program,
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                    },
                    attributes: ['id', 'name', 'timeToSwap'],
                },
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'authorName', 'screen', 'status', 'message'],
            },
            attributes: ['id', 'isAccepted', 'approved', 'changer', 'isActive', 'inProcessing'],
            order: [
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    'timeToSwap', 'ASC'
                ],
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    { model: Event, as: 'events' },
                    'order', 'ASC'
                ],
            ],
        });
    }

    /**
     * Добавить запрос (отправить композицию на модерацию)
     *
     * - id : ID композиции, которую необходимо отправить в запросе
     * - date : Дата, на которую планируется установить данную композицию
     *
     * @param params Входные POST параметры
     * @return Сообщение об успешной отправке
     */
    async addOne(params)
    {
        const { user } = params;

        if (!['admin', 'moderator', 'editor'].includes(user.role)) {
            throw new Error('Недостаточно прав доступа');
        }

        const { id, date } = params?.body;

        if (!name) {
            throw new Error('Нельзя отправить программу с пустым именем');
        }

        if (!date) {
            throw new Error('Нельзя отправить программу без указания даты установки');
        }

        const compose = await Compose.findOne({
            where: {
                id: id,
            },
        });

        if (!compose instanceof Compose) {
            throw new Error('Некорректный ID композиции');
        }

        if (compose.authorName !== user.name) {
            throw new Error('Только автор может отправить данную программу на модерацию.');
        }

        const req = await Request.findOne({
            where: {
                composeId: compose.id,
            },
        });

        if (req.id) {
            throw new Error('Данная композиция уже была отправлена в модерацию.');
        }

        await Request.create({
            composeId: compose.id,
            isAccepted: false,
            approved: null,
            isActive: false,
            inProcessing: false,
        });

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        const expires = currentDate.toISOString().split('T')[0];

        await Note.create({
            name: 'Запрос отправлен',
            comment: 'Вы успешно отправили запрос на модерацию.',
            expires: expires,
            authorName: 'System',
            onBroadcast: false,
            addressedTo: user.name,
        });

        return 'Шаблон успешно отправлен на модерацию.';
    }

    /**
     * Обновить состояние запроса
     *
     * - id : ID обновляемого запроса
     * - operation [
     *      'approved' => <approve_msg> ], - утвержден / сообщение для редактора
     *      'rejected' => <reject_msg>  ], - отклонен / сообщение для редактора
     *      'changed'  => <changed_obj> ], - внесены изменения в программы / измененный запрос
     *   ] : Мутация (утверждение / отклонение / изменение)
     *
     * @param params Входные POST параметры
     * @return number Обновленный запрос / флаг обновленного статуса
     */
    async updateOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { id, operation } = params?.body;

        if (operation['rejected']) {
            const composeId = (await Request.findOne({
                where: {
                    id: id,
                },
                attributes: ['composeId'],
            })).composeId;

            await Request.destroy({
                where: {
                    id: id,
                },
            });

            return Compose.update({
                status: 'rejected',
                message: operation['rejected'],
            }, {
                where: {
                    id: composeId,
                },
            })[0];

        } else {

            if (operation['changed']) {
                // Обновление композиции, программ

            }

            if (operation['approved']) {
                const composeId = (await Request.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ['composeId'],
                })).composeId;

                await Request.update({
                    isAccepted: true,
                    approved: user.name,
                    inProcessing: false,
                }, {
                    where: {
                        id: id,
                    },
                });

                await Compose.update({
                    status: 'approved',
                    message: operation['approved'],
                }, {
                    where: {
                        id: composeId,
                    },
                });
            }

            return 1;
        }
    }

    /**
     * Установка запроса активным принудительно
     *
     * - id : ID устанавливаемого запроса
     * - action {
     *      type: [ 'delete' / 'queue' / 'return' ],
     *      with: [   <->    / <date> / <message> ],
     *  }: Действие над старым шаблоном
     *
     * @param params Входные POST параметры
     * @return Promise<Request> Установленный запрос
     */
    async setActive(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { id, action } = params?.body;

        const newRequest = await Request.findOne({
            where: {
                id: id,
            },
            nest: true,
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'programs',
                    model: Program,
                },
            },
            order: [
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    'timeToSwap', 'ASC'
                ],
            ],
        });

        const oldRequest = await Request.findOne({
            where: {
                isActive: true,
            },
        });

        if (!newRequest.id) {
            throw new Error('Некорректный ID');
        }

        switch (action.type) {
            case 'delete':
                await composeService.deleteOne({
                    user: user,
                    body: {
                        id: oldRequest.composeId,
                        withPrograms: true,
                        byModer: true,
                    },
                });
                break;
            case 'queue':
                const targetDate = action.with;

                await Request.update({
                    isActive: false,
                }, {
                    where: {
                        isActive: true,
                    },
                });

                await Compose.update({
                    date: targetDate,
                }, {
                    where: {
                        id: oldRequest.composeId,
                    },
                });

                await Program.update({
                    isActive: false,
                }, {
                    where: {
                        composeId: oldRequest.composeId,
                        isActive: true,
                    },
                });
                break;
            case 'return':
                const message = action.with;

                await Compose.update({
                    status: 'returned',
                    message: message,
                }, {
                    where: {
                        id: oldRequest.composeId,
                    },
                });

                await Request.destroy({
                    where: {
                        id: oldRequest.id,
                    },
                });
                break;
            default:
                throw new Error('Некорректный запрос: действие не определено')
        }

        await Request.update({
            isActive: true,
        }, {
            where: {
                id: newRequest.id,
            },
        });

        await Compose.update({
            status: 'active',
        }, {
            where: {
                id: newRequest.composeId,
            },
        });

        const between = (time, left, right) =>
        {
            return [time, left, right].sort()[1] === time;
        }

        let date = new Date();
        let time = date.getHours() + ':' + date.getMinutes();

        if (!newRequest.compose.isSpecial) {
            const state = [
                ['00:00', '08:20', 'Обед'],
                ['08:20', '08:40', 'Перерыв'],
                ['08:40', '10:15', 'Пара'],
                ['10:15', '10:25', 'Перерыв'],
                ['10:25', '12:00', 'Пара'],
                ['12:00', '12:50', 'Обед'],
                ['12:50', '14:25', 'Пара'],
                ['14:25', '14:35', 'Перерыв'],
                ['14:35', '16:10', 'Пара'],
                ['16:10', '16:20', 'Перерыв'],
                ['16:20', '17:50', 'Пара'],
                ['17:50', '23:59', 'Обед'],
            ];

            let origin = ['Пара', 'Перерыв', 'Обед'];
            let currentState;

            for (let i in state) {
                if (between(time, state[i][0], state[i][1])) {
                    currentState = state[i][2];
                    break;
                }
            }

            await Program.update({
                isActive: true,
            }, {
                where: {
                    id: newRequest.compose.programs[origin.indexOf(currentState)],
                },
            });

        } else {

            let index = -1;

            for (let i in newRequest.compose.programs) {
                if (i < newRequest.compose.programs.length - 1) {
                    if (between(time, newRequest.compose.programs[i], newRequest.compose.programs[i + 1])) {
                        index = i;
                        break;
                    }
                }
                index = i;
            }

            await Program.update({
                isActive: true,
            }, {
                where: {
                    id: newRequest.compose.programs[index],
                },
            });
        }

        return Request.findOne({
            nest: true,
            where: {
                id: id,
            },
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'programs',
                    model: Program,
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                    },
                    attributes: ['id', 'name', 'timeToSwap'],
                },
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'authorName', 'screen', 'status', 'message'],
            },
            attributes: ['id', 'isAccepted', 'approved', 'changer', 'isActive', 'inProcessing'],
            order: [
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    'timeToSwap', 'ASC'
                ],
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    { model: Event, as: 'events' },
                    'order', 'ASC'
                ],
            ],
        });
    }

    /**
    * Получить данные активной программы в формате JSON (вывод на трансляцию)
    *
    * @return {Promise<*>} Список страниц для трансляции
    */
    async getActiveJSON()
    {
        const request = await Request.findOne({
            nest: true,
            where: {
                isActive: true,
            },
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'programs',
                    model: Program,
                    where: {
                        isActive: true,
                    },
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['src', 'type'],
                    },
                    attributes: ['id', 'name'],
                },
                attributes: ['id', 'name'],
            },
            attributes: ['id'],
            order: [
                [
                    { model: Compose, as: 'compose' },
                    { model: Program, as: 'programs' },
                    { model: Event, as: 'events' },
                    'order', 'ASC'
                ],
            ],
        });

        let events = [];
        let eventsJson = [];
        let datetimeOrder = (new Date()).getTime();

        if (request instanceof Request) {
            request.compose.programs[0].events;
        }

        for (let i in events) {
            eventsJson.push({
                time: new Date(datetimeOrder),
                type: events[i].type,
                src: events[i].src,
            });
            datetimeOrder += events[i].time * 1000;
        }

        eventsJson.push({
            time: new Date(datetimeOrder),
            type: "end",
            src: "src"
        });

        return eventsJson;
    }

    /**
     * Взятие в обработку / завершение процесса обработки
     *
     * @param params Входные POST параметры.
     * @return String Флаг успешной операции.
     */
    async toggleProcess(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { id } = params.body;

        return await Request.update({
            inProcessing: Sequelize.literal('NOT inProcessing'),
            changer: user.name,
        }, {
            where: {
                id: id,
            },
        });
    }

    /**
     * Завершение обработки для пользователя
     *
     * @param params Входные POST параметры
     * @returns number Статус операции
     */
    async endProcess(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        return Request.update({
            inProcessing: false,
            changer: null,
        }, {
            where: {
                inProcessing: true,
                changer: user.name,
            },
        });
    }

    /**
     * Проверка наличия доступа к части функционала
     *
     * @param role Роль пользователя в системе
     */
    checkRole(role)
    {
        if (!['admin', 'moderator'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }

}

module.exports = new RequestService();