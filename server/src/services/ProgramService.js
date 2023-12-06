const { Event, Program, User } = require('../../models');

/**
 * Class ProgramService
 * Работа с программами трансляции
 *
 * @package src/services
 */
class ProgramService {
    /**
     * Получить список всех собственных программ пользователя, не вложенных в композиции
     *
     * Для programs:
     * -> composeId - флаг проверки вложенности в композицию (null - не вложен)
     *
     * @return Promise<json> Запрашиваемые данные в виде объекта
     */
    async getAll(params) {
        const { user } = params;
        this.checkRole(user.role);

        return Program.findAll({
            nest: true,
            where: {
                authorId: user.userId,
            },
            include: [
                {
                    as: 'events',
                    model: Event,
                    attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                },
                {
                    as: 'author',
                    model: User,
                    attributes: ['name'],
                },
            ],
            order: [
                ['createdAt', 'DESC'],
                [{ model: Event, as: 'events' }, 'order', 'ASC'],
            ],
            attributes: ['id', 'name', 'composeId'],
        });
    }

    /**
     * Открыть содержимое программы
     *
     * @param params Входные GET параметры
     * @return Promise<Event> Список событий программы
     */
    async getOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id } = params.body;

        return Program.findOne({
            nest: true,
            where: {
                id: id,
            },
            include: [
                {
                    as: 'events',
                    model: Event,
                    attributes: ['id', 'name', 'src', 'type', 'time', 'order'],
                },
                {
                    as: 'author',
                    model: User,
                },
            ],
            order: [[{ model: Event, as: 'events' }, 'order', 'ASC']],
            attributes: ['id', 'name', 'composeId'],
        });
    }

    /**
     * Создать новую программу
     *
     * @param params Входные POST параметры
     * @return Promise<Program> Новая программа
     */
    async addOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { name, type } = params?.body;

        if (name.length > 30) {
            throw new Error('Слишком длинное имя программы');
        }

        const test = await Program.findOne({
            where: {
                name: name,
                authorId: user.userId,
            },
        });

        if (test instanceof Program) {
            throw new Error('Программа с заданным именем уже существует');
        }

        const program = await Program.create({
            name: name,
            authorId: user.userId,
            composeId: null,
            timeToSwap: null,
        });

        switch (type) {
            case 'empty':
                break;
            case 'copy':
                const { events } = params?.body;

                let order = 1;
                for (let i in events) {
                    try {
                        await Event.create({
                            name: events[i].name,
                            src: events[i].src,
                            order: order,
                            isActive: true,
                            type: events[i].type,
                            time: events[i].time,
                            programId: program.id,
                        });

                        order++;
                    } catch (err) {
                        throw new Error(err.message);
                    }
                }
                break;
            case 'default':
                try {
                    await Event.create({
                        name: 'Объявления в системе',
                        src: '/adscast',
                        order: 1,
                        isActive: true,
                        type: 'webform',
                        time: 40,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'Карта К3',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/K3_Pascal_map/',
                        order: 2,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'Карта Артек',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/Artek_Pascal_map/',
                        order: 3,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'К3 - Артек',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/K3-Artek/',
                        order: 4,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'Аудитории - Гидра',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/Hydra-K3g/',
                        order: 5,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'Гидра - Влажность',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/TV_Hum/',
                        order: 6,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                    await Event.create({
                        name: 'Гидра - Температура',
                        src: 'http://webrobo.mgul.ac.ru:3000/forms/TV_Temp/',
                        order: 7,
                        isActive: true,
                        type: 'webform',
                        time: 15,
                        programId: program.id,
                    });
                } catch (err) {
                    throw new Error(err.message);
                }
        }

        return this.getOne({
            user: user,
            body: {
                id: program.id,
            },
        });
    }

    /**
     * Обновление данных программы (сохранение)
     *
     * @param params Входные POST параметры
     * @return Promise<Event> Обновленный список событий внутри программы
     */
    async updateOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id, events } = params?.body;

        const program = await Program.findOne({
            where: {
                id: id,
            },
            attributes: ['id', 'name', 'composeId'],
        });

        if (program instanceof Program && program.composeId !== null) {
            throw new Error('Cannot update included into compose program');
        }

        await Event.destroy({
            where: {
                programId: id,
            },
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
                    programId: id,
                });

                order++;
            } catch (err) {
                throw new Error(err.message);
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
     * Удалить программу с указанным ID
     *
     * @param params Входные GET параметры
     */
    async deleteOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { id } = params?.body;

        return Program.destroy({
            where: {
                id: id,
            },
        });
    }

    /**
     * Получить список программ, доступных для замены в композициях
     *
     * @param {*} params Входные GET-параметры
     * @returns Promise<Program> Список собственных не использованных программ пользователя
     */
    async selfPrograms(params) {
        const { user } = params;
        this.checkRole(user.role);

        return Program.findAll({
            nest: true,
            where: {
                authorId: user.userId,
                composeId: null,
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name'],
        });
    }

    /**
     * Проверка наличия доступа к части функционала
     *
     * @param role Роль пользователя в системе
     */
    checkRole(role) {
        if (!['admin', 'moderator', 'editor'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }
}

module.exports = new ProgramService();
