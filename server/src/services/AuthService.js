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
     * @param params Входные POST параметры
     * @return object Данные авторизованного аккаунта
     */
    async signIn(params)
    {
        const { login, password } = params?.body;

        const user = await User.findOne({
            where: {
                login: login,
            },
            include: {
                as: 'role',
                model: Role,
                attributes: ['role'],
            },
            nest: true,
        });

        if (!user.id) {
            throw new Error('Пользователь с данным логином не найден');
        }

        const correctPassword = await argon2.verify(user.passHash, password);

        if (!correctPassword) {
            throw new Error('Incorrect password');
        }

        const actualNotes = await Note.findAll({
            where: {
                addressedTo: null,
            },
        });

        const personalNotes = await Note.findAll({
            where: {
                addressedTo: user.login,
            },
        });

        const viewed = await User_Note.findAll({
            where: {
                userId: user.id,
            },
        });

        let roleStr = user.role.role;

        const token = jwt.sign(
            {
                userId: user.id,
                login,
                name: user.name,
                role: roleStr,
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        return {
            token: token,
            unread: actualNotes.length + personalNotes.length - viewed.length,
            name: user.name,
            role: user.role,
        };
    }
}

module.exports = new AuthService();