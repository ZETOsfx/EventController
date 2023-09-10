require('dotenv').config();
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const db = require('../../config/dbConfig');

class AdminService {

        /**
         * @method ''
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         */
    async signInAsync(req, res, next) {

        const { login, password } = req.body;

        const userData = await db.select('*').from('ec_user').where({ login });

        if (userData[0]) {
            const correctPassword = await argon2.verify(userData[0].passhash, password);
            if (correctPassword) {
                    // Актуальные события (общие)
                const _ads = await db('ads').select('*').where('personal', null);
                    // Персональные уведомления (только для данного профиля)
                const personal_ads = await db('ads').select('*').where('personal', userData[0].login)
                    // Список сообщений, которые данный пользователь уже просмотрел
                const userAds = await db('user_ads').select('*').where('user_id', userData[0].id);
                const user_role = await db('ec_role').select('*').where('id', userData[0].role_id);
                
                // Генерация JWT-токена 
                const token = jwt.sign(
                    { user_id: userData[0].id, login, name: userData[0].name, role: user_role[0].role },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                const user = {
                    token:  token,
                    noread: _ads.length + personal_ads.length - userAds.length,
                    name:   userData[0].name,
                    role:   user_role[0].role,
                }

                console.log('user sended');
                console.log(user);

                return res.status(200).json(user);
            }
        }
        return res.status(401).end();
    }

}

module.exports = new AdminService()