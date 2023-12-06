const { Note } = require('../../models');

/**
 * Class MessageService
 * Отправка уведомлений
 *
 * @package src/services
 */
class MessageService {
    /**
     * Отправка уведомления
     *
     * @param { header,         // Заголовок уведомления
     *         description,     // Тело уведомления
     *         authorId,        // ID автора уведомления
     *         actualCntDays,   // Число дней, по истечении которого уведомление автоматически удалится
     *         addressedToName, // Имя профиля назначения -> NULL - будет видно всем
     *         onBroadcast      // Флаг отображения на трансляции
     *         }
     */
    async sendMessage({ header, description, authorId, actualCntDays, addressedToName, onBroadcast = false }) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + actualCntDays);
        const expires = currentDate.toISOString().split('T')[0];

        await Note.create({
            name: header,
            comment: description,
            expires: expires,
            authorId: authorId,
            onBroadcast: onBroadcast,
            addressedTo: addressedToName,
        });
    }
}

module.exports = new MessageService();
