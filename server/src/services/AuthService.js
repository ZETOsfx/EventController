require('dotenv').config();

const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const { User, Role, Note, User_Note } = require('../../models');

/**
 * Class AuthService
 * Авторизация пользователей
 *
 * @package src/services
 */
class AuthService
{
    /**
     * Основной метод авторизации
     *
     * @param params Входные параметры запроса
     * @return object Данные авторизованного аккаунта
     */
    async signIn(params)
    {
        const { login, password } = params.body;

        const user = await User.findAll({
            where: {
                login: login,
            },
            include: {
                model: Role,
            },
            nested: true,
            raw: true,
        });

        if (user[0] === undefined) {
            throw new Error('Missing login');
        }

        const correctPassword = await argon2.verify(user[0].passHash, password);

        if (!correctPassword) {
            throw new Error('Incorrect password');
        }

        const actualNotes = await Note.findAll({
            where: {
                addressedTo: null,
            },
            nested: true,
            raw: true,
        });

        const personalNotes = await Note.findAll({
            where: {
                addressedTo: user[0].login,
            },
            nested: true,
            raw: true,
        });

        const viewed = await User_Note.findAll({
            where: {
                userId: user[0].id,
            },
            raw: true,
        });

        const token = jwt.sign(
            {
                user_id: user[0].id,
                login,
                name: user[0].name,
                role: user[0]['Role.role'],
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        const authUser = {
            token: token,
            news: actualNotes.length + personalNotes.length - viewed.length,
            name: user[0].name,
            role: user[0]['Role.role'],
        }

        console.log(authUser);

        return authUser;
    }
}

module.exports = new AuthService();