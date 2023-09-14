require('dotenv').config();

const { Op } = require("sequelize");
const { Note, User_Note } = require('../../models');

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

/**
 * Class ReportService
 *
 * @package src/services
 */
class ReportService
{
    /**
     * Отправить отчет об ошибке в системе
     *
     * @param params Входные POST параметры
     * @return Promise<string> Результат попытки отправить отчет
     */
    async sendReport(params)
    {
        const { user } = params;
        const { short, description, timecode, browserData, osData } = params.body;

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
            }
        });

        let mail = MailGenerator.generate({
            body: {
                title: 'Пользователь ' + user.name + ' уведомляет об ошибке.',
                intro: short,
                outro: [ description, 'Время ошибки: ' + timecode, 'Браузер пользователя: ' + browserData, 'ОС пользователя: ' + osData ],
                signature: 'C уважением'
            }
        });

        let message = {
            from: '"Команда EventСontroller" <' + process.env.EMAIL + '>',
            to: '"Почта яндекс" <' + process.env.TARGET_EMAIL + '>, "Почта МГТУ" <' + process.env.EMAIL + '>',
            subject: 'Bug report',
            html: mail,
            sender: 'Команда EventController'
        };

        try {
            transporter.sendMail(message);

            const callback = 'Ваше сообщение об ошибке успешно отправлено. Спасибо, что обратили внимание на проблему. ';

            await Note.create({
                name: "Уведомление об ошибке",
                comment: callback,
                expires: this.getDate(),
                authorName: "System",
                onBroadcast: false,
                addressedTo: user.name,
            });

            return callback;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    getDate()
    {
        let date = new Date();
        let dd = ("0" + date.getDate()).slice(-2);
        let mm = ("0" + (date.getMonth() + 1)).slice(-2);
        let yyyy = date.getFullYear();

        if (((Number(mm) % 2 === 1 && Number(mm) <= 7) || (Number(mm) > 7 && Number(mm) % 2 === 0)) && Number(dd) > 28) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
            }
        } else if ((Number(mm) === 4 || Number(mm) === 6 || Number(mm) === 9 || Number(mm) === 11) && Number(dd) > 27) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
            }
        } else if (Number(mm) === 2 && Number(dd) > 25) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
            }
        } else {
            if (Number(dd) + 3 < 10) {
                return yyyy + '-' + mm + '-0' + (Number(dd) + 3);
            } else {
                return yyyy + '-' + mm + '-' + (Number(dd) + 3);
            }
        }
    }
}

module.exports = new ReportService();