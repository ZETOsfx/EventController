require('dotenv').config();

const db = require('../../config/dbConfig')['migrations'];
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        refreshToken: process.env.REFRESH_TOKEN_MAIL,
        clientId: process.env.CLIENT_ID_MAIL,
        clientSecret: process.env.CLIENT_SECRET_MAIL
    },
});

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Команда EventController',
        link: 'http://rstring.mgul.ac.ru'
    }
});

function getDate() {
    let date_ob = new Date();
    let dd = ("0" + date_ob.getDate()).slice(-2);
    let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let yyyy = date_ob.getFullYear();

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

/**
 * Class ManagerService
 *
 * @package src/routes
 */
class ManagerService {
    /**
     * Получение списка уведомлений
     *
     * @param { * } req Входные GET параметры
     * @return array Список уведомлений в системе
     */
    async getNotes(req, res) {

        const ads = await db('ads')
            .select('*')
            .orderBy('id', 'desc')
            .where(function () {
                this.where('personal', null).orWhere('personal', req.user.name)
            });

        const userAds = await db('user_ads')
            .select('*')
            .where('user_id', req.user.user_id);

        let isHere;

        for (let i in ads) {
            isHere = false;
            for (let j in userAds) {
                if (ads[i].id === userAds[j].ads_id) {
                    isHere = true;
                }
            }

            if (!isHere) {
                await db('user_ads').insert({
                    user_id: req.user.user_id,
                    ads_id: ads[i].id,
                });
            }
        }

        return res.status(200).json(ads);
    }

    /**
     * Добавление уведомления в систему
     *
     * @param { * } req Входные GET параметры
     * @return object Callback + Уведомление в виде объекта
     */
    async addNote(req, res) {

        if (!['admin', 'moder', 'adsender'].includes(req.user.role)) {
            return res.redirect('/404');
        }

        const {name, comment, translate, unlimited} = req?.body;

        if (name === '' || comment === '') {
            return res.status(400).json({
                callback: 'error',
                message: 'Поля "Заголовок" и "Содержимое" должны быть заполнены.',
            });
        }

        let {time} = req?.body;

        if (!(translate !== undefined && unlimited !== undefined && time)) {
            return res.status(400).json({
                callback: 'error',
                message: 'Нарушена целостность запроса.',
            });
        }

        if (unlimited) {
            time = "9999-01-01";
        }

        let ads = await db('ads').insert({
            name: name,
            comment: comment,
            timeOfLife: time,
            author: req.user.name,
            translate: translate,
        }).returning('*');

        let user = await db('ec_user').where('name', req.user.name);

        await db('user_ads').insert({
            user_id: user[0].id,
            ads_id: ads[0].id,
        });

        return res.status(200).json({
            callback: 'success',
            message: 'Уведомление успешно добавлено. ',
            ads,
        });
    }

    /**
     * Удаление уведомления
     *
     * @param { * } req Входные GET параметры
     * @return void
     */
    async deleteNote(req, res) {

        if (!['admin', 'moder', 'adsender'].includes(req.user.role)) {
            return res.redirect('/404');
        }

        const {id} = req.body;
        await db('ads').where('id', id).del();

        return res.status(200).end();
    }

    /**
     * Получение списка уведомлений, отображаемых на трансляции
     *
     * @param { * } req Входные GET парамтетры
     * @return array Список уведомлений, отображаемых на трансляции
     */
    async getNotesTranslate(req, res) {

        const ads = await db('ads').select('*')
            .where('translate', 'true')
            .orderBy('id');

        return res.status(200).json(ads);
    }

    /**
     * Отправка уведомления об ошибке
     *
     * @param { * }             req
     * @param { short }         req  Header of mail
     * @param { description }   req  Body of mail
     * @param { timecode }      req  Concrete time report sended
     * @param { author }        req  Debian
     * @param { browserData }   req  browser name + browser version (данные о браузере пользвателя - может быть важно)
     * @param { osData }        req  data about users OS + Version
     * @param { * }             res
     */
    async sendReport(req, res) {

        const {short, description, timecode, author, browserData, osData} = req?.body;

        if (!short && !description)
            return res.status(400).json({msg: 'error', err: 'Необходимые поля не заполнены. '});

        // Генерация самого письма
        let mail = MailGenerator.generate({
            body: {
                title: 'Пользователь ' + author + ' уведомляет об ошибке.',
                intro: short,
                outro: [description, 'Время ошибки: ' + timecode, 'Браузер пользователя: ' + browserData, 'ОС пользователя: ' + osData],
                signature: 'C уважением'
            }
        });
        // Параметры письма при отправке
        let message = {
            from: '"Команда EventСontroller" <' + process.env.EMAIL + '>',
            to: '"Почта яндекс" <' + process.env.TARGET_EMAIL + '>, "Почта МГТУ" <' + process.env.EMAIL + '>',
            subject: 'Bug report',
            html: mail,
            sender: 'Команда EventController'
        };

        try {
            transporter.sendMail(message);

            const callback = 'Ваше ообщение об ошибке успешно отправлено. Спасибо, что обратили внимание на проблему. ';

            await db('ads').insert({
                name: "Уведомление об ошибке",
                comment: callback,
                timeOfLife: getDate(),
                author: "System",
                translate: "false",
                personal: author
            });

            return res.status(200).json({msg: 'succ'});
        } catch (err) {
            return res.status(504).json({msg: 'error', err});
        }
    }
}

module.exports = new ManagerService();