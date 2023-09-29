const { Op } = require("sequelize");
const { Note, User_Note } = require('../../models');

/**
 * Class NoteService
 *
 * @package src/services
 */
class NoteService
{
    /**
     * Получение полного списка уведомлений (при прочтении)
     *
     * @param params Входные GET параметры
     * @return Promise<array> Список всех актуальных уведомлений в системе
     */
    async getAll(params)
    {
        const { user } = params;
        const { unread } = params.body;

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
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        if (unread !== 0) {
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
        }

        return notes;
    }

    /**
     * Получение списка уведомлений, отображаемых на трансляции
     *
     * @return Promise<array> Список уведомлений, отображаемых на трансляции
     */
    async getFromCast()
    {
        return Note.findAll({
            where: {
                onBroadcast: true,
                addressedTo: null,
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });
    }

    /**
     * Добавить уведомление
     *
     * @param params Входные POST параметры
     * @return Promise<Note> Добавленное уведомление
     */
    async addOne(params)
    {
        const { user } = params;
        await this.checkRole(user.role);

        const { name, comment, translate, unlimited, addressedTo } = params.body;
        let { time } = params?.body;

        if (name === '' || comment === '') {
            throw new Error('Поля "Заголовок" и "Содержимое" должны быть заполнены');
        }

        if (translate === undefined || unlimited === undefined || time === undefined) {
            throw new Error('Нарушена целостность запроса.');
        }

        if (unlimited) {
            time = "9999-01-01";
        }

        const note = await Note.create({
            name: name,
            comment: comment,
            expires: time,
            authorName: user.name,
            onBroadcast: translate,
            addressedTo: addressedTo | null,
        });

        if (!addressedTo) {
            await User_Note.create({
                userId: user.userId,
                noteId: note.id,
            });
        }

        return note;
    }

    /**
     * Удалить уведомление из системы
     *
     * @param params Входные POST параметры
     * @return Promise<Note> Удаленное уведомление
     */
    async deleteOne(params)
    {
        const { user } = params;
        await this.checkRole(user.role);

        const { id } = params.body;

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
    checkRole(role)
    {
        if (!['admin', 'moderator', 'manager'].includes(role)) {
            throw new Error('Недостаточно прав доступа');
        }
    }
}

module.exports = new NoteService();