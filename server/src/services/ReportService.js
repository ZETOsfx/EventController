require('dotenv').config();

const { User } = require('../../models');
const messageService = require('./MessageService');

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

/**
 * Class ReportService
 * Обработка отправки обратной связи
 *
 * @package src/services
 */
class ReportService {
    /**
     * Отправить отчет об ошибке в системе
     *
     * @param params Входные POST параметры
     * @return string Сообщение об успешной отправке
     */
    async sendReport(params) {
        const { user } = params;
        const { short, description, browserData, osData } = params.body;

        if (!short || !description) {
            throw new Error('Необходимые поля не заполнены');
        }

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                refreshToken: process.env.REFRESH_TOKEN_MAIL,
                clientId: process.env.CLIENT_ID_MAIL,
                clientSecret: process.env.CLIENT_SECRET_MAIL,
            },
        });

        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Команда EventController',
                link: 'http://rstring.mgul.ac.ru',
            },
        });

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        const expires = currentDate.toISOString().split('T')[0];

        let mail = MailGenerator.generate({
            body: {
                title: 'Пользователь ' + user.name + ' уведомляет об ошибке.',
                intro: short,
                outro: [description, 'Время ошибки: ' + currentDate, 'Браузер пользователя: ' + browserData, 'ОС пользователя: ' + osData],
                signature: 'C уважением',
            },
        });

        let message = {
            from: '"Команда EventСontroller" <' + process.env.EMAIL + '>',
            to: '"Почта яндекс" <' + process.env.TARGET_EMAIL + '>, "Почта МГТУ" <' + process.env.EMAIL + '>',
            subject: 'Bug report',
            html: mail,
            sender: 'Команда EventController',
        };

        try {
            await transporter.sendMail(message);

            const systemUser = await User.findOne({
                where: {
                    name: 'System',
                },
                attributes: ['id'],
            });

            await messageService.sendMessage({
                header: 'Уведомление об ошибке',
                description: 'Ваше сообщение об ошибке успешно отправлено. Спасибо, что обратили внимание на проблему. ',
                authorId: systemUser.id,
                actualCntDays: 3,
                addressedToName: user.name,
            });

            return 'Отчет об ошибке успешно отправлен';
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new ReportService();
