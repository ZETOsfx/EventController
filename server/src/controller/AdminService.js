require('dotenv').config();
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const db = require('../../config/dbConfig')['migrations'];    // Database connection

class AdminService {
        /**
         * @method '/register' [POST]
         * @param { * }         req 
         * @param { name }      req  New username
         * @param { login }     req  New user's login
         * @param { password }  req  User's password
         * @param { role }      req  User's role
         * @param { * }         res 
         */
    async registerAsync(req, res) {

        if (!['admin'].includes(req.user.role))
            return res.redirect('/404');

        const { name, login, password, role } = req.body;

        if (!(login !== '' && password !== '' && name !== '' && role !== '')) 
            return res.status(400).json({ result: 'error', message: 'Заполните все поля для нового пользователя.'});

        const _userLogin = await db('ec_user').select('*').where({ login });
        if (_userLogin[0] !== undefined)
            return res.status(400).json({ result: 'error', message: 'Пользователь с данным логином уже существует.'});

        const _userName = await db('ec_user').select('*').where({ name });
        if (_userName[0] !== undefined)
            return res.status(400).json({ result: 'error', message: 'Пользователь с данным именем уже существует.'});

        let role_list = [];
        const _roles = await db('ec_role').select('*');
        for (let i in _roles) 
            role_list.push(_roles[i].role);
        if (!role_list.includes(role))
            return res.status(400).json({ result: 'error', message: 'Некорректный параметр: РОЛЬ.'});
            
        let newUser, role_id;
        const hashedPassword = await argon2.hash(password);
        
        role_id = await db('ec_role').select('id').where({ role });
        newUser = await db('ec_user').insert({ 
            login,
            name,    
            role_id: role_id[0].id, 
            passhash: hashedPassword 
        }).returning('*');
        // const _ads = await db('ads').select('*').orderBy('id');
    
        newUser[0].role = role;
        return res.status(200).json({ result: 'success', message: 'Новый пользователь успешно добавлен.', user: newUser[0] });
    }
    
        /**
         * @method ''
         * @param {*} req 
         * @param {*} res 
         */
    async getAllUsers(req, res) {

        if (!['admin'].includes(req.user.role))
            return res.redirect('/404');
        
        const users = await db.select('*').from('ec_user').where('name', '!=', 'System');

        for (let i in users) 
            users[i].role = (await db('ec_role').select('role').where('id', users[i].role_id))[0].role;
        
        return res.status(200).json(users);
    }
        
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
        
        /**
         * @method ''
         * @param {*} req 
         * @param {*} res 
         */
    async updateUser(req, res) {

        if (!['admin'].includes(req.user.role))
            return res.redirect('/404');

        const { id, name, login, role, password } = req.body;
        const role_id = await db('ec_role').select('*').where({ role });
        if (role_id[0] === undefined)
            return res.status(400).json({ result: 'error', message: 'Некорректный параметр: РОЛЬ. Пожалуйста, хватит "тестировать" нашу форму. Сергей Александрович, мы знаем, что это вы.'});
        
        if (login && name && password !== '') {
            const hashedPassword = await argon2.hash(password);
            await db('ec_user')
                .where({ id })
                .update({
                    login: login,
                    name: name,
                    role_id: role_id[0].id,
                    passhash: hashedPassword
                });
        } else if (password === '') {
            await db('ec_user')
                .where('id', id)
                .update({
                    name: name,
                    login: login,
                    role_id: role_id[0].id
                });
        } else {
            return res.status(200).json({ result: 'error', message: 'Отсутствует одно из обязательных полей: "Имя", "Логин", "Роль".'});
        } 

        // Пробежать по шаблонам и объявлениям с заменой авторства

        return res.status(200).json({ result: 'success', message: 'Изменения успешно применены.'})
    }
       
        /**
         * @method ''
         * @param {*} req 
         * @param {*} res 
         */
    async deleteUser(req, res) {
  
        if (!['admin'].includes(req.user.role))
            return res.redirect('/404');
            // Операция администратора "удаление пользователя" - автоматически удаляет заданный
            // пользовательский профиль и его уведомления.
            //  - id (user_id) / int - идентификатор профиля, который будет удален
        const { id } = req?.body;

        try         { await db('ec_user').where('id', id).del(); }       
        catch(err)  { console.log(err); }
        
        return res.status(200).end();
    }
       
        /**
         * Log output
         * @method ''
         * @param {*} req 
         * @param {*} res 
         */
    async logPanel(req, res) {

        if (!['admin'].includes(req.user.role))
            return res.redirect('/404');

        // let logData  = [];      // Результирующий лог
        // let logGroup = [];      // Группы логов
        let logRes = [];

            // Список профилей (формат JSON)
        // const users = await db('ec_user').select('*').orderBy([{ column: 'role', order: 'desc' }]);
        
        //     // Выборка действий только с событиями и объединение в группы логов
        // const groupMax = await db('log').select('*').where('object', 'event').orderBy('e_group', 'desc');
        // try {
        //     let group = groupMax[0].e_group;
        //         // Тупо все события по порядку действий (дата + время)
        //     for (let i = 1; i < group + 1; i++) {
        //         const bigLog = await db('log').select('*').where('object', 'event').where('e_group', i).orderBy('date', 'asc').orderBy('time', 'asc');
        //         logGroup.push(bigLog);
        //     }

        //     const miniLog = await db('log').select('*').orderBy('date', 'time').where('object', 'ads');

        //         // ОБЪЕДИНЕНИЕ 
        //     for (let i in logGroup)
        //         logData.push(logGroup[i]);
        //     for (let i in miniLog) 
        //         logData.push(miniLog[i]);

        //     let logId = [];
        //     for (let i in logData) {
        //         try {
        //             logId.push(logData[i][0].id);
        //         } catch (err) {
        //             logId.push(logData[i].id);
        //         }
        //     }
            
        //     logId.sort();

        //     let id;     // АЙДИШНИК ИЗ ЗАПИСИ СОБЫТИЯ ИЛИ ОБЪЯВЛЕНИЯ
        //     for (let i in logId) {
        //         for (let j in logData) {
        //             try {
        //                 id = logData[j][0].id;
        //             } catch (cock) {
        //                 id = logData[j].id;
        //             }
        //             if (logId[i] === id) {
        //                 logreturn res.push(logData[j])
        //             }
        //         }
        //     }
        // } catch (e) {
        //     logRes = [''];
        // }

        return res.status(200).json({ title, session: req.session, logData: logRes, API_URL: process.env.API_URL, NODE_ENV: process.env.NODE_ENV });
    }
}

module.exports = new AdminService()