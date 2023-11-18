const argon2 = require("argon2");

const { Op } = require("sequelize");
const { User, Role } = require('../../models');

/**
 * Class UserService
 * Работа с аккаунтами пользователей
 *
 * @package src/services
 */
class UserService
{
    /**
     * Получить список всех аккаунтов в системе
     *
     * @param params Входные параметры запроса
     * @return Array Список аккаунтов в системе
     */
    async getAll(params)
    {
        this.accessCheck(params);

        let response = [];

        let users = await User.findAll({
            include: {
                as: 'role',
                model: Role,
                attributes: ['role'],
            },
        });

        users.forEach(user =>
        {
            response.push({
                id: user.id,
                name: user.name,
                role: user.role.role,
                login: user.login,
            });
        });

        return response;
    }

    /**
     * Добавление нового аккаунта
     *
     * @param params Входные параметры запроса
     * @return Object Добавленный аккаунт
     */
    async addOne(params)
    {
        this.accessCheck(params);

        const { name, login, password, role } = params.body;

        if (!login || !password || !name || !role) {
            throw new Error('Не все обязательные поля были заполнены');
        }

        const userExists = await this.isUserExists(name, login);

        if (userExists instanceof User) {
            throw new Error('Пользователь с данным логином или именем уже существует');
        }

        const roleExists = await this.isRoleExists(role);

        if (!(roleExists instanceof Role)) {
            throw new Error('Некорректный параметр: РОЛЬ');
        }

        const hashedPassword = await argon2.hash(password);

        let user = await User.create({
            login: login,
            name: name,
            roleId: roleExists.id,
            passHash: hashedPassword,
        });

        user.role = roleExists.role;

        return {
            id: user.id,
            name: name,
            role: role,
            login: login,
        };
    }

    /**
     * Обновить данные определенного аккаунта
     *
     * @param params Входные параметры запроса
     * @return Object Данные обновленного аккаунта
     */
    async updateOne(params)
    {
        this.accessCheck(params);

        const { id, name, login, role, password } = params.body;

        if (!id || !login || !name || !role) {
            throw new Error('Не все обязательные поля были заполнены');
        }

        const userExists = await this.isUserExists(name, login);

        if (!userExists.id) {
            throw new Error('Пользователь с данными логином и именем не существует');
        }

        const roleExists = await this.isRoleExists(role);

        if (!roleExists.id) {
            throw new Error('Некорректный параметр: РОЛЬ');
        }

        const hashedPassword = await argon2.hash(password);

        if (password !== '') {
            return User.update({
                login: login,
                name: name,
                roleId: roleExists.id,
                passHash: hashedPassword,
            }, {
                where: {
                    id: id,
                },
            });
        } else {
            return User.update({
                login: login,
                name: name,
                roleId: roleExists.id,
            }, {
                where: {
                    id: id,
                },
            });
        }
    }

    /**
     * Удалить определенный аккаунт из системы
     *
     * @param params Входные параметры запроса
     * @return Object Данные удаленного аккаунта
     */
    async deleteOne(params)
    {
        this.accessCheck(params);
        const { id } = params.body;

        return User.destroy({
            where: {
                id: id,
            },
        });
    }

    /**
     * Проверка наличия доступа к сервису управления аккаунтами
     * - разрешение есть только у администраторов
     *
     * @param params Входные параметры запроса
     */
    accessCheck(params)
    {
        if (!['admin'].includes(params.user.role)) {
            throw new Error('Нет прав доступа');
        }
    }

    /**
     * Проверка наличия аккаунта в системе с заданными логином или именем
     *
     * @param name Имя аккаунта
     * @param login Логин аккаунта
     * @option
     * @return Promise Аккаунт / undefined
     */
    async isUserExists(name, login)
    {
        return await User.findOne({
            where: {
                [Op.or]: [
                    {
                        login: login,
                    },
                    {
                        name: name,
                    },],
            },
        });
    }

    /**
     * Наличие указанной роли в системе (проверка на корректность)
     *
     * @param role Роль для проверки на наличие
     * @return Promise Роль / undefined
     */
    async isRoleExists(role)
    {
        return Role.findOne({
            where: {
                role: role,
            },
        });
    }
}

module.exports = new UserService();