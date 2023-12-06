const { Event, Program, Compose, Request, User } = require('../../models');

const composeService = require('./ComposeService');
const messageService = require('./MessageService');

/**
 * Class RequestService
 * Работа с запросами на модерацию
 *
 * @package src/services
 */
class RequestService {
    /**
     * Получить все существующие запросы в системе
     *
     * @param params Входные GET параметры
     * @return json Список всех запросов в системе
     */
    async getAll(params) {
        const { user } = params;
        this.checkRole(user.role);

        return Request.findAll({
            nest: true,
            include: {
                as: 'compose',
                model: Compose,
                include: [
                    {
                        as: 'programs',
                        model: Program,
                        include: {
                            as: 'events',
                            model: Event,
                            attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                        },
                        attributes: ['id', 'name', 'timeToSwap'],
                    },
                    {
                        as: 'author',
                        model: User,
                        attributes: ['name'],
                    },
                ],
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'status', 'message'],
            },
            attributes: ['id', 'isAccepted', 'approved', 'changer', 'isActive', 'inProcessing'],
            order: [
                [{ model: Compose, as: 'compose' }, { model: Program, as: 'programs' }, 'timeToSwap', 'ASC'],
                [{ model: Compose, as: 'compose' }, { model: Program, as: 'programs' }, { model: Event, as: 'events' }, 'order', 'ASC'],
            ],
        });
    }

    /**
     * Получить данные запроса с указанным ID в установленной форме
     * @param id ID запроса, данные которого необходимо получить
     * @returns {Promise<Model>} Данные запроса в базе
     */
    async getOne(id) {
        return Request.findOne({
            where: {
                id: id,
            },
            nest: true,
            include: {
                as: 'compose',
                model: Compose,
                include: [
                    {
                        as: 'programs',
                        model: Program,
                        include: {
                            as: 'events',
                            model: Event,
                            attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                        },
                        attributes: ['id', 'name', 'timeToSwap'],
                    },
                    {
                        as: 'author',
                        model: User,
                        attributes: ['name'],
                    },
                ],
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'status', 'message'],
            },
            attributes: ['id', 'composeId', 'isAccepted', 'approved', 'changer', 'isActive', 'inProcessing'],
            order: [
                [{ model: Compose, as: 'compose' }, { model: Program, as: 'programs' }, 'timeToSwap', 'ASC'],
                [{ model: Compose, as: 'compose' }, { model: Program, as: 'programs' }, { model: Event, as: 'events' }, 'order', 'ASC'],
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
     * @return number Флаг успешной отправки
     */
    async addOne(params) {
        const { user } = params;

        if (!['admin', 'moderator', 'editor'].includes(user.role)) {
            throw new Error('Недостаточно прав доступа');
        }

        const { id, name, description, date } = params?.body;

        if (!name) {
            throw new Error('Нельзя отправить программу с пустым именем');
        }
        if (!date) {
            throw new Error('Нельзя отправить программу без указания даты установки');
        }

        const req = await Request.findOne({
            where: {
                composeId: id,
            },
        });

        if (req instanceof Request) {
            throw new Error('Данная композиция уже находится в модерации');
        }

        const compose = await Compose.update(
            {
                name: name,
                comment: description,
                date: date,
                status: 'sent',
            },
            {
                where: {
                    id: id,
                    authorId: user.userId,
                },
            }
        );

        if (compose[0] === 0) {
            throw new Error('Некорректный ID композиции');
        }

        await Request.create({
            composeId: id,
            isAccepted: false,
            approved: null,
            isActive: false,
            inProcessing: false,
        });

        const systemUser = await User.findOne({
            where: {
                name: 'System',
            },
            attributes: ['id'],
        });

        await messageService.sendMessage({
            header: 'Запрос отправлен',
            description: 'Вы успешно отправили запрос на модерацию',
            authorId: systemUser.id,
            actualCntDays: 3,
            addressedToName: user.name,
        });

        return 1;
    }

    /**
     * Отозвать
     * @param params Входные POST-параметры
     * @returns {Promise<void>}
     */
    async recall(params) {
        const { user } = params;

        if (!['admin', 'moderator', 'editor'].includes(user.role)) {
            throw new Error('Недостаточно прав доступа');
        }

        const { id } = params?.body;

        await Request.destroy({
            where: {
                composeId: id,
            },
        });

        return Compose.update(
            {
                status: 'created',
                message: null,
            },
            {
                where: {
                    id: id,
                },
            }
        )[0];
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
     * @return Promise
     */
    async updateOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id, operation } = params?.body;

        const request = await Request.findOne({
            nest: true,
            where: {
                id: id,
            },
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'author',
                    model: User,
                    attributes: ['id', 'name'],
                },
            },
        });

        if (operation['rejected']) {
            await Request.destroy({
                where: {
                    id: id,
                },
            });

            const systemUser = await User.findOne({
                where: {
                    name: 'System',
                },
                attributes: ['id'],
            });

            await messageService.sendMessage({
                header: 'Запрос ' + request.compose.name + ' отклонен',
                description: 'Комментарий модератора: ' + operation['rejected'],
                authorId: systemUser.id,
                actualCntDays: 3,
                addressedToName: request.compose.author.name,
            });

            return Compose.update(
                {
                    status: 'rejected',
                    message: operation['rejected'],
                },
                {
                    where: {
                        id: request.compose.id,
                    },
                }
            )[0];
        } else {
            if (operation['changed']) {
                const { forDate, programs, eventList, timingList } = operation['changed'];

                if (!operation['approved']) {
                    await Request.update(
                        {
                            inProcessing: false,
                        },
                        {
                            where: {
                                id: id,
                            },
                        }
                    );
                }

                composeService.updateOne({
                    user: user,
                    body: {
                        id: request.composeId,
                        forDate,
                        programs,
                        eventList,
                        timingList,
                    },
                });
            }
            if (operation['approved']) {
                await Request.update(
                    {
                        isAccepted: true,
                        approved: user.name,
                        inProcessing: false,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                const systemUser = await User.findOne({
                    where: {
                        name: 'System',
                    },
                    attributes: ['id'],
                });

                await messageService.sendMessage({
                    header: 'Запрос ' + request.compose.name + ' утвержден',
                    description: 'Комментарий модератора: ' + operation['approved'],
                    authorId: systemUser.id,
                    actualCntDays: 3,
                    addressedToName: request.compose.author.name,
                });

                return Compose.update(
                    {
                        status: 'approved',
                        message: operation['approved'],
                    },
                    {
                        where: {
                            id: request.compose.id,
                        },
                    }
                )[0];
            }
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
    async setActive(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id, action } = params?.body;

        const newRequest = await this.getOne(id);
        const oldRequest = await Request.findOne({
            nest: true,
            where: {
                isActive: true,
            },
            include: {
                as: 'compose',
                model: Compose,
                include: {
                    as: 'author',
                    model: User,
                    attributes: ['name'],
                },
                attributes: ['name'],
            },
        });

        if (oldRequest instanceof Request) {
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

                    await Request.update(
                        {
                            isActive: false,
                        },
                        {
                            where: {
                                isActive: true,
                            },
                        }
                    );
                    await Compose.update(
                        {
                            date: targetDate,
                            status: 'approved',
                        },
                        {
                            where: {
                                id: oldRequest.composeId,
                            },
                        }
                    );
                    await Program.update(
                        {
                            isActive: false,
                        },
                        {
                            where: {
                                isActive: true,
                            },
                        }
                    );
                    break;
                case 'return':
                    const message = action.with;

                    await Compose.update(
                        {
                            status: 'returned',
                            message: message,
                        },
                        {
                            where: {
                                id: oldRequest.composeId,
                            },
                        }
                    );
                    await Program.update(
                        {
                            isActive: false,
                        },
                        {
                            where: {
                                isActive: true,
                            },
                        }
                    );

                    const systemUser = await User.findOne({
                        where: {
                            name: 'System',
                        },
                        attributes: ['id'],
                    });
                    await messageService.sendMessage({
                        header: 'Композиция ' + oldRequest.compose.name + ' возвращена после трансляции',
                        description: 'Комментарий модератора: ' + action.with,
                        authorId: systemUser.id,
                        actualCntDays: 3,
                        addressedToName: oldRequest.compose.author.name,
                    });

                    await Request.destroy({
                        where: {
                            id: oldRequest.id,
                        },
                    });
                    break;
                default:
                    throw new Error('Некорректный запрос: действие не определено');
            }
        }

        /** Broadcast cleared */
        if (!(newRequest instanceof Request)) {
            return null;
        }

        await Request.update(
            {
                isActive: true,
            },
            {
                where: {
                    id: newRequest.id,
                },
            }
        );
        await Compose.update(
            {
                status: 'active',
            },
            {
                where: {
                    id: newRequest.composeId,
                },
            }
        );

        const between = (time, left, right) => {
            return [time, left, right].sort()[1] === time || time === left;
        };

        let date = new Date();
        let hh = date.getHours();
        let mm = date.getMinutes();
        let time = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ':00';

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
            await Program.update(
                {
                    isActive: true,
                },
                {
                    where: {
                        id: newRequest.compose.programs[origin.indexOf(currentState)].id,
                    },
                }
            );
        } else {
            let idActive = -1;
            for (let i = 0; i < newRequest.compose.programs.length - 1; i++) {
                if (between(time, newRequest.compose.programs[i].timeToSwap, newRequest.compose.programs[i + 1].timeToSwap)) {
                    idActive = newRequest.compose.programs[i].id;
                }
            }
            if (idActive === -1) {
                const lastProgram = newRequest.compose.programs.pop();
                const date1 = new Date('2023-11-11T' + time + 'Z');
                const date2 = new Date('2023-11-11T' + lastProgram.timeToSwap + 'Z');

                if (date1 > date2) {
                    idActive = lastProgram.id;
                } else {
                    idActive = newRequest.compose.programs[0].id;
                }
            }

            await Program.update(
                {
                    isActive: true,
                },
                {
                    where: {
                        id: idActive,
                    },
                }
            );
        }
        return this.getOne(id);
    }

    /**
     * Получить транслируемую композицию
     *
     * @returns {Promise<Model>}
     */
    async getActiveRequest() {
        return Request.findOne({
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
                        attributes: ['src', 'type', 'time'],
                    },
                    attributes: ['id', 'name'],
                },
                attributes: ['id', 'name'],
            },
            attributes: ['id', 'updatedAt'],
            order: [[{ model: Compose, as: 'compose' }, { model: Program, as: 'programs' }, { model: Event, as: 'events' }, 'order', 'ASC']],
        });
    }

    /**
     * Получить данные активной программы в формате JSON (вывод на трансляцию)
     *
     * @return {Promise<*>} Список страниц для трансляции
     */
    async getActiveJSON() {
        const request = await this.getActiveRequest();

        if (!(request instanceof Request)) {
            throw new Error('Трансляция пуста');
        }

        let events = request.compose.programs[0].events;
        let eventsJson = [];

        const currentDateTime = new Date();
        const updatedAt = new Date(request.updatedAt);

        let cycleDuration = 0;
        for (let i in events) {
            cycleDuration += events[i].time;
        }

        const mark = (Math.abs(currentDateTime - updatedAt) / 1000) % cycleDuration;
        let dateTimeOrder = new Date(Date.now() - mark * 1000).getTime();

        for (let i in events) {
            eventsJson.push({
                time: new Date(dateTimeOrder),
                type: events[i].type,
                src: events[i].src,
            });
            dateTimeOrder += events[i].time * 1000;
        }

        eventsJson.push({
            time: new Date(dateTimeOrder),
            type: 'end',
            src: 'src',
        });

        return eventsJson;
    }

    /**
     * Взятие в обработку / завершение процесса обработки
     *
     * @param params Входные POST параметры.
     * @return String Флаг успешной операции.
     */
    async toggleProcess(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id, inProcessing } = params.body;

        const request = await Request.findOne({
            nest: true,
            where: {
                id: id,
            },
            attributes: ['composeId', 'isActive', 'isAccepted'],
        });

        await Compose.update(
            {
                status: inProcessing ? 'processing' : request.isActive ? 'active' : request.isAccepted ? 'approved' : 'sent',
            },
            {
                where: {
                    id: request.composeId,
                },
            }
        );

        return Request.update(
            {
                inProcessing: inProcessing,
                changer: inProcessing ? user.name : null,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    }

    /**
     * Завершение обработки для пользователя
     *
     * @param params Входные POST параметры
     * @returns {Promise<String>} Статус операции
     */
    async endProcess(params) {
        const { user } = params;
        this.checkRole(user.role);

        const request = await Request.findOne({
            where: {
                inProcessing: true,
                changer: user.name,
            },
            attributes: ['id'],
        });

        if (!(request instanceof Request)) {
            return null;
        }

        return this.toggleProcess({
            user: user,
            body: {
                id: request.id,
                inProcessing: false,
            },
        });
    }

    /**
     * Проверка наличия доступа к части функционала
     *
     * @param role Роль пользователя в системе
     */
    checkRole(role) {
        if (!['admin', 'moderator'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }

    /**
     * Проверка наличия утвержденного запроса на указанную дату для указанного экрана
     * @param screen Экран
     * @param date Дата
     * @returns boolean Флаг наличия
     */
    async hasRequestOnDate(screen, date) {
        const request = await Request.findAll({
            where: {
                screen: screen,
                date: date,
                isAccepted: true,
            },
        });
        return request[0] instanceof Request;
    }
}

module.exports = new RequestService();
