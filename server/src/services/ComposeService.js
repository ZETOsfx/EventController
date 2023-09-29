const { Op } = require("sequelize");
const { Program, Compose, Event } = require('../../models');

const programService = require('./ProgramService');

/**
 * Class ProgramService
 * Работа с аккаунтами пользователей
 *
 * @package src/services
 */
class ComposeService
{
    /**
     * Получить все композиции (собственные для пользователя + все остальные)
     *
     * @param params Входные GET параметры
     * @return {Promise<{otherComposes: *, userComposes: *}>} Композиции запрашивающего + все остальные
     */
    async getAll(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        return {
            userComposes: await Compose.findAll({
                nest: true,
                where: {
                    authorName: user.name,
                },
                include: {
                    as: 'programs',
                    model: Program,
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                    },
                    attributes: ['id', 'name', 'timeToSwap', 'isActive'],
                },
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'authorName', 'screen', 'status', 'message'],
                order: [
                    [
                        { model: Program, as: 'programs' },
                        'timeToSwap', 'ASC'
                    ],
                    [
                        { model: Program, as: 'programs' },
                        { model: Event, as: 'events' },
                        'order', 'ASC'
                    ],
                    ['createdAt', 'DESC'],
                ],
            }),
            otherComposes: await Compose.findAll({
                nest: true,
                where: {
                    authorName: {
                        [Op.ne]: user.name,
                    },
                },
                include: {
                    as: 'programs',
                    model: Program,
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                    },
                    attributes: ['id', 'name', 'timeToSwap', 'isActive'],
                },
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'authorName', 'screen', 'status', 'message'],
                order: [
                    [
                        { model: Program, as: 'programs' },
                        'timeToSwap', 'ASC'
                    ],
                    [
                        { model: Program, as: 'programs' },
                        { model: Event, as: 'events' },
                        'order', 'ASC'
                    ],
                    ['createdAt', 'DESC'],
                ],
            }),
        };
    }

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

        const { id } = params?.body;

        return Compose.findOne({
            nest: true,
            where: {
                id: id,
            },
            include: {
                as: 'programs',
                model: Program,
                include: {
                    as: 'events',
                    model: Event,
                    attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                },
                attributes: ['id', 'name', 'timeToSwap', 'isActive'],
            },
            attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'authorName', 'screen', 'status', 'message'],
            order: [
                [
                    { model: Program, as: 'programs' },
                    'timeToSwap', 'ASC'
                ],
                [
                    { model: Program, as: 'programs' },
                    { model: Event, as: 'events' },
                    'order', 'ASC'
                ],
            ],
        });
    }

    /**
     * Собрать композицию
     *
     * - name : Имя новой композиции
     * - screen : Экран, на который планируется транслировать композицию
     * - programsId : Список ID программ, которые должны быть включены в композицию
     * - times : Список меток времени, в которые должны происходить переходы между программами
     * - isSpec : Тип новой композиции (специальная / стандартная)
     * - comment : Комментарий к композиции (не обязательно)
     *
     * @param params Входные POST параметры
     * @return { compose, programs } Новая композиция в виде объекта и список ее программ
     */
    async addOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { name, screen, programsId, times, isSpec, comment = '' } = params?.body;

        const test = await Compose.findOne({
            where: {
                name: name,
                authorName: user.name,
            },
        });

        if (test instanceof Compose) {
            throw new Error('Программа с таким заголовком уже существует. Для однозначной идентификации придумайте другой');
        }

        let date = new Date();
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let currentDate = year + '-' + month + '-' + day;

        if (isSpec === true) {
            if (!name || programsId.length === 0 || !screen) {
                throw new Error('Композиция должна включать хотя бы одну программу');
            }
            if (programsId.length !== times.length) {
                throw new Error('Некорректный запрос: не для всех шаблонов задано время.');
            }
        } else {
            if (!name || (programsId[0] === '-' || programsId[1] === '-' || programsId[2] === '-') || !screen) {
                throw new Error('Некорректный запрос');
            }

            const programs = await Program.findAll({
                where: {
                    id: {
                        [Op.or]: programsId,
                    }
                },
            });

            if (programs.length !== 3) {
                throw new Error('Некорректный ID');
            }
        }

        const compose = await Compose.create({
            name: name,
            comment: comment,
            date: currentDate,
            isSpecial: isSpec,
            authorName: user.name,
            screen: screen,
        });

        let timings = times;

        if (!isSpec) {
            timings = ['08:40:00', '10:15:00', '12:00:00'];
        }

        for (let index in programsId) {
            const updatedTemplate = await Program.update({
                composeId: compose.id,
                timeToSwap: timings[index],
            }, {
                where: {
                    id: programsId[index],
                },
            });

            if (updatedTemplate[0] === 0) {
                throw new Error('Некорректный ID: ' + programsId);
            }
        }

        return await this.getOne({
            user: user,
            body: {
                id: compose.id,
            },
        });
    }

    /**
     * Удалить композицию
     *
     * - id : ID композиции, которую нужно удалить
     * - withPrograms (true / false) : Удалить вместе с программами?
     *
     * @param params Входные DELETE параметры
     * @return
     */
    async deleteOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { id, withPrograms, byModer } = params?.body;

        const compose = await Compose.findOne({
            where: {
                id: id,
                authorName: user.name,
            },
        });

        if (!compose.id && !byModer) {
            throw new Error('Попытка удалить не свою композицию.');
        }

        if (!withPrograms) {
            await Program.update({
                timeToSwap: null,
                composeId: null,
            }, {
                where: {
                    composeId: compose.id
                },
            });
        }

        return Compose.destroy({
            where: {
                id: id,
                authorName: user.name,
            },
        });
    }

    /**
     * Внести изменения в существующую композицию
     *
     * - id : ID композиции, в которую вносятся изменения
     * - programs : список с новыми программами в композиции
     *      > 3 для стандартной программы (в порядке: пары - перерыв - обед)
     *      > ANY для особой программы
     * - timingList : список переключения программ по времени внутри композиции
     *      > существует только для особого типа
     *      > число элементов совпадает с числом программ
     * - forDate : дата, на которую планируется транслировать композицию
     * - eventList : сгруппированные списки событий в необходимом порядке
     *      > под индексами программ без изменений лежат значения NULL
     *
     * @param params Входные POST параметры
     * @returns { compose, programs } Измененная композиция и список программ
     */
    async updateOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { id, forDate, programs, eventList, timingList } = params?.body;

        if (!programs) {
            throw new Error('Попытка сохранить пустую композицию.');
        }

        const compose = await Compose.findOne({
            where: {
                id: id,
            },
        });

        if (!compose.isSpecial) {
            if (programs.length !== 3) {
                throw new Error('Для стандартной композиции определены не все программы.');
            }
        }

        if (compose.isSpecial && programs.length !== timingList.length) {
            throw new Error('Некорректный запрос: несовпадение числа таймингов и программ.');
        }

        await Compose.update({
            date: forDate,
        }, {
            where: {
                id: id,
            },
        });

        await Program.update({
            composeId: null,
            timeToSwap: null,
        }, {
            where: {
                composeId: id,
            },
        });

        let timings = timingList;

        if (!compose.isSpecial) {
            timings = ['08:40:00', '10:15:00', '12:00:00'];
        }

        for (let i in programs) {
            let result = await Program.update({
                composeId: id,
                timeToSwap: timings[i],
            }, {
                where: {
                    id: programs[i].id,
                    composeId: null,
                },
            });

            if (!result) {
                throw new Error('Некорректный запрос: передан ID несуществующей программы');
            }

            if (eventList[i] !== null) {
                let data = {
                    user: user,
                    body: {
                        programId: programs[i].id,
                        events: eventList[i],
                    },
                }

                await programService.updateOne(data);
            }
        }

        return await this.getOne({
            user: user,
            body: {
                id: id,
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
        if (!['admin', 'moderator', 'editor'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }
}

module.exports = new ComposeService();