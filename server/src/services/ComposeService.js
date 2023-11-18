const { Op } = require("sequelize");
const { Program, Compose, Event, User } = require('../../models');

const programService = require('./ProgramService');

/**
 * Class ComposeService
 * Работа с композициями программ
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
                    authorId: user.userId,
                },
                include: [
                    {
                        as: 'programs',
                        model: Program,
                        include: {
                            as: 'events',
                            model: Event,
                            attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                        },
                        attributes: ['id', 'name', 'timeToSwap', 'isActive'],
                    },
                    {
                        as: 'author',
                        model: User,
                        attributes: ['name'],
                    },
                ],
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'status', 'message'],
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
                    authorId: {
                        [Op.ne]: user.userId,
                    },
                },
                include: [
                    {
                        as: 'programs',
                        model: Program,
                        include: {
                            as: 'events',
                            model: Event,
                            attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                        },
                        attributes: ['id', 'name', 'timeToSwap', 'isActive'],
                    },
                    {
                        as: 'author',
                        model: User,
                        attributes: ['name'],
                    },
                ],
                attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'status', 'message'],
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
            include: [
                {
                    as: 'programs',
                    model: Program,
                    include: {
                        as: 'events',
                        model: Event,
                        attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                    },
                    attributes: ['id', 'name', 'timeToSwap', 'isActive'],
                },
                {
                    as: 'author',
                    model: User,
                    attributes: ['name'],
                },
            ],
            attributes: ['id', 'name', 'comment', 'date', 'isSpecial', 'status', 'message'],
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

        const { name, screen, programsId, times, isSpec, comment = '' } = params.body;

        const test = await Compose.findOne({
            where: {
                name: name,
                authorId: user.userId,
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
        }

        const compose = await Compose.create({
            name: name,
            comment: comment,
            date: currentDate,
            isSpecial: isSpec,
            authorId: user.userId,
            status: 'created',
        });

        let timings = times;
        let processedIds = [];

        if (!isSpec) {
            timings = ['08:40:00', '10:15:00', '12:00:00'];
        }

        for (let index in programsId) {
            if (processedIds.includes(programsId[index])) {
                const dp = await Program.findOne({
                    where: { id: programsId[index] },
                    raw: true,
                });

                delete dp.id;
                const duplicate = await Program.create(dp);

                const e = await Event.findAll({
                    where: { programId: programsId[index] },
                    raw: true,
                    order: [['order', 'ASC']],
                });

                for (let i in e) {
                    delete e[i].id;
                    e[i].programId = duplicate.id;
                    await Event.create(e[i]);
                }

                programsId[index] = duplicate.id;
            }

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

            processedIds.push(programsId[index]);
        }

        return this.getOne({
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
        const { id, withPrograms, byModer } = params?.body;

        this.checkRole(user.role);

        const compose = await Compose.findOne({
            where: {
                id: id,
                authorId: user.userId,
            },
        });

        if (!(compose instanceof Compose) && !byModer) {
            throw new Error('Попытка удалить не свою композицию.');
        }

        if (withPrograms) {
            await Program.destroy({
                where: {
                    composeId: compose.id,
                },
            });
        } else {
            let duplicatesToDestroy = [];

            const programs = await Program.findAll({
                where: {
                    composeId: compose.id,
                },
                attributes: ['id', 'name'],
                order: [
                    ['timeToSwap', 'ASC'],
                ],
            });

            for (let i = 0; i < programs.length; i++) {
                if (duplicatesToDestroy.includes(programs[i].id)) {
                    continue;
                }
                for (let j = i + 1; j < programs.length; j++) {
                    if ((programs[i].name === programs[j].name) && !(duplicatesToDestroy.includes(programs[j].id))) {
                        duplicatesToDestroy.push(programs[j].id);
                    }
                }
            }

            await Program.destroy({
                where: {
                    id: duplicatesToDestroy,
                    composeId: compose.id,
                },
            });
        }

        return Compose.destroy({
            where: {
                id: id,
                authorId: user.userId,
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
                await programService.updateOne({
                    user: user,
                    body: {
                        id: programs[i].id,
                        events: eventList[i],
                    },
                });
            }
        }

        return this.getOne({
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