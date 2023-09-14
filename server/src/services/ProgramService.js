const { Op } = require("sequelize");
const { Event, Program, Compose } = require('../../models');

/**
 * Class ProgramService
 * Работа с аккаунтами пользователей
 *
 * @package src/services
 */
class ProgramService
{
    /**
     * Получить рабочий материал для настройки трансляции
     * -> свои рабочие шаблоны (не скомпонованные)
     * -> все существующие композиции
     *
     * Для programs:
     * -> composeId - флаг проверки вложенности в композицию (null - не вложен)
     *
     * @return Promise<json> Запрашиваемые данные в виде объекта
     */
    async getWorkingData(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const programs = await Program.findAll({
            where: {
                authorName: user.name,
            },
            order: [
                [ 'createdAt', 'DESC' ],
            ],
            nested: true,
            raw: true,
        });

        const userComposes = await Compose.findAll({
            where: {
                authorName: user.name,
            },
            order: [
                [ 'createdAt', 'DESC' ],
            ],
            nested: true,
            raw: true,
        });

        const otherComposes = await Compose.findAll({
            where: {
                authorName: {
                    [Op.ne]: user.name,
                },
            },
            order: [
                [ 'createdAt', 'DESC' ],
            ],
            nested: true,
            raw: true,
        });

        // for (let index in userComposes) {
        //     if (userComposes[index].isSpecial) {
        //
        //         userComposes[index].spectemplates = await db('tmp_cmp')
        //             .select('*')
        //             .where('from', composes[index].id)
        //             .orderBy('time_to_swap');
        //
        //         for (let i in composes[index].spectemplates) {
        //             let time = composes[index].spectemplates[i].time_to_swap;
        //             composes[index].spectemplates[i].time_to_swap = time.substring(0, 5);
        //         }
        //     }
        // }

        return {
            programs: programs,
            myComposes: userComposes,
            otherComposes: otherComposes,
        };
    }

    /**
     * Открыть содержимое программы
     *
     * @param params Входные GET параметры
     * @return Promise<Event> Список событий программы
     */
    async getOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { programId, programName } = params.body;

        if (!await this.programExists(programName, user.name)) {
            throw new Error('Запрашиваемая программа не существует');
        }

        return await Event.findAll({
            where: {
                programId: programId,
                programName: programName,
            },
            raw: true,
            order: [
                [ 'order' ],
            ]
        });
    }

    /**
     * Создать новую программу
     *
     * @param params Входные POST параметры
     * @return Promise<Program> Новая программа
     */
    async addOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { name, tmpType } = params.body;

        if (name.length > 30) {
            throw new Error('Слишком длинное имя программы');
        }

        if (await this.programExists(name, user.name)) {
            throw new Error('Программа с заданным именем уже существует');
        }

        const newProgram = await Program.create({
            name: name,
            authorName: user.name,
            composeId: null,
            timeToSwap: null,
        });

        switch (tmpType) {
            case 'empty':
                break;
            case 'copy':
                const { events } = params.body;

                let order = 1;
                for (let i in events) {
                    try {
                        const event = await Event.create({
                            name: events[i].name,
                            src: events[i].src,
                            order: order,
                            isActive: true,
                            type: events[i].type,
                            time: events[i].time,
                            programId: newProgram.id,
                        });

                        order++;
                    } catch (err) {
                        throw new Error(err.message);
                    }
                }
                break;
            case 'default':
                const t = await Event.transaction();

                try {
                    await Event.create({
                        name: "Объявления в системе",
                        src: 'http://rstring.mgul.ac.ru/adscast',
                        order: 1,
                        isActive: true,
                        type: 'webform',
                        time: 40,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "Карта К3",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/K3_Pascal_map/',
                        order: 2,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "Карта Артек",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/Artek_Pascal_map/',
                        order: 3,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "К3 - Артек",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/K3-Artek/',
                        order: 4,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "Аудитории - Гидра",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/Hydra-K3g/',
                        order: 5,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "Гидра - Влажность",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/TV_Hum/',
                        order: 6,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });
                    await Event.create({
                        name: "Гидра - Температура",
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/TV_Temp/',
                        order: 7,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: newProgram.id,
                    }, { transaction: t });

                    await t.commit();
                } catch (err) {
                    await t.rollback();
                    throw new Error(err.message);
                }
        }

        const events = await Event.findAll({
            where: {
                programId: newProgram.id,
            },
            raw: true,
        });

        return {
            program: newProgram,
            events: events,
        };
    }

    /**
     * Обновление данных программы (сохранение)
     *
     * @param params Входные POST параметры
     * @return Promise<Event> Обновленный список событий внутри программы
     */
    async updateOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { programId, events } = params.body;

        await Event.destroy({
            where: {
                programId: programId,
            }
        });

        let order = 1;
        for (let i in events) {
            try {
                await Event.create({
                    name: events[i].name,
                    src: events[i].src,
                    time: events[i].time,
                    type: events[i].type,
                    order: order,
                    isActive: true,
                    programId: programId,
                });

                order++;
            } catch (err) {
                throw new Error(err.message);
            }
        }

        const program = await Program.findOne({
            where: {
                id: programId,
            },
            raw: true,
        });

        const newEvents = await Event.findAll({
            where: {
                programId: programId,
            },
            raw: true,
        });

        return {
            program: program,
            events: newEvents,
        };
    }

    /**
     * Удалить программу с указанным ID
     *
     * @param params Входные GET параметры
     */
    async deleteOne(params)
    {
        const { user } = params;
        this.checkRole(user.role);

        const { programId } = params.body;

        await Program.destroy({
            where: {
                id: programId,
            },
        });
    }

    /**
     * Проверка наличия в системе программы с указанным именем
     *
     * @param programName Имя программы, которое необходимо проверить
     * @param username Имя автора программы
     * @return Promise<boolean> Наличие программы с подобным именем
     */
    async programExists(programName, username)
    {
        const program = await Program.findAll({
            where: {
                name: programName,
                authorName: username,
            },
            raw: true,
        });

        return program.length > 0;
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

module.exports = new ProgramService();