require('dotenv').config();

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const { Op } = require('sequelize');
const { User, Role, Note, User_Note } = require('../../models');

/**
 * Class AuthService
 * Авторизация пользователей
 *
 * @package src/services
 */
class AuthService {
    /**
     * Основной метод авторизации
     *
     * @param params Входные POST параметры
     * @return object Данные авторизованного аккаунта
     */
    async signIn(params) {
        const { login, password } = params?.body;

        const user = await User.findOne({
            where: { login },
            include: {
                as: 'role',
                model: Role,
                attributes: ['role'],
            },
            nest: true,
        });

        if (!user.id) {
            throw new Error('User not found');
        }

        const correctPassword = await argon2.verify(user.passHash, password);

        if (!correctPassword) {
            throw new Error('Incorrect password');
        }

        const notes = await Note.findAll({
            where: {
                addressedTo: {
                    [Op.or]: [null, user.login],
                },
            },
        });

        let actualNotes = 0;
        let personalNotes = 0;

        for (let note of notes) {
            if (note.addressedTo === null) {
                actualNotes++;
                continue;
            }
            personalNotes++;
        }

        const viewed = await User_Note.findAll({
            where: {
                userId: user.id,
            },
            attributes: ['id'],
        });

        const role = user.role.role;

        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                login,
                role,
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h',
            }
        );

        return {
            token,
            role,
            unread: actualNotes + personalNotes - viewed.length,
            name: user.name,
        };
    }
}

module.exports = new AuthService();
