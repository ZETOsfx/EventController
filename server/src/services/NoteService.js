const { Op } = require('sequelize');
const { Note, User, User_Note } = require('../../models');

/**
 * Class NoteService
 * Работа с уведомлениями в системе
 *
 * @package src/services
 */
class NoteService {
    /**
     * Получение полного списка уведомлений (при прочтении)
     *
     * @param params Входные GET параметры
     * @return Promise<array> Список всех актуальных уведомлений в системе
     */
    async getAll(params) {
        const { user } = params;

        const notes = await Note.findAll({
            where: {
                [Op.or]: [
                    {
                        addressedTo: null,
                    },
                    {
                        addressedTo: user.name,
                    },
                ],
            },
            include: {
                as: 'author',
                model: User,
                attributes: ['name'],
            },
            nest: true,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'comment', 'addressedTo', 'expires', 'onBroadcast'],
        });

        await User_Note.destroy({
            where: {
                userId: user.userId,
            },
        });

        for (let i in notes) {
            await User_Note.create({
                userId: user.userId,
                noteId: notes[i].id,
            });
        }

        return notes;
    }

    /**
     * Получить конкретное уведомление из хранилища
     *
     * @param {*} id ID уведомления
     * @returns
     */
    async getOne(id) {
        return Note.findOne({
            where: {
                id: id,
            },
            include: {
                as: 'author',
                model: User,
                attributes: ['name'],
            },
            nest: true,
            attributes: ['id', 'name', 'comment', 'addressedTo', 'expires', 'onBroadcast'],
        });
    }

    /**
     * Получение списка уведомлений, отображаемых на трансляции
     *
     * @return Promise<array> Список уведомлений, отображаемых на трансляции
     */
    async getFromCast() {
        return Note.findAll({
            where: {
                onBroadcast: true,
                addressedTo: null,
            },
            include: {
                as: 'author',
                model: User,
                attributes: ['name'],
            },
            nest: true,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'comment', 'addressedTo', 'expires', 'onBroadcast'],
        });
    }

    /**
     * Добавить уведомление
     *
     * @param params Входные POST параметры
     * @return Promise<Note> Добавленное уведомление
     */
    async addOne(params) {
        const { user } = params;
        this.checkRole(user.role);

        const { name, comment, translate, unlimited, addressedTo } = params?.body;
        let { time } = params?.body;

        if (name === '' || comment === '') {
            throw new Error('Поля "Заголовок" и "Содержимое" должны быть заполнены');
        }

        if (translate === undefined || unlimited === undefined || time === undefined) {
            throw new Error('Нарушена целостность запроса.');
        }

        if (unlimited) {
            time = '9999-01-01';
        }

        const note = await Note.create({
            name: name,
            comment: comment,
            expires: time,
            authorId: user.userId,
            onBroadcast: translate,
            addressedTo: addressedTo,
        });

        if (!addressedTo) {
            await User_Note.create({
                userId: user.userId,
                noteId: note.id,
            });
        }

        return this.getOne(note.id);
    }

    /**
     * Удалить уведомление из системы
     *
     * @param params Входные POST параметры
     * @return Promise<Note> Удаленное уведомление
     */
    async deleteOne(params) {
        const { user } = params;
        const { id } = params.body;

        const note = await Note.findOne({
            where: {
                id: id,
            },
        });

        if (!(['admin', 'moderator', 'manager'].includes(user.role) || note.addressedTo === user.name)) {
            throw new Error('Недостаточно прав доступа');
        }

        return Note.destroy({
            where: {
                id: id,
            },
        });
    }

    /**
     * Проверка наличия доступа к части функционала
     *
     * @param role Роль пользователя в системе
     */
    checkRole(role) {
        if (!['admin', 'moderator', 'manager'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }

    /**
     * Процедура очистки просроченных по актуальности уведомлений
     *
     * @returns {Promise<void>}
     */
    async clearExpires() {
        const currentDate = new Date(Date.now());
        await Note.destroy({
            where: {
                expires: {
                    [Op.lt]: currentDate,
                },
            },
        });
    }
}

module.exports = new NoteService();
