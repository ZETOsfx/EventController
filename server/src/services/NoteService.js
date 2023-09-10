require('dotenv').config();

const Note = require('../../models/Note');

/**
 * Class NoteService
 *
 * @package src/services
 */
class NoteService {

    async getAll(req, res){

    }

    /**
     * Получение списка уведомлений, отображаемых на трансляции
     *
     * @param { * } req Входные GET парамтетры
     * @return json Список уведомлений, отображаемых на трансляции
     */
    async getFromCast(req, res) {

        const notesOnCast = await Note.findAll({
            where: {
                onBroadcast: true,
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        console.log(notesOnCast);

        return res.status(200).json({});
    }
}

module.exports = new NoteService();