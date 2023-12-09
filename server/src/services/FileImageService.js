require('dotenv').config();

const { File, User } = require('../../models');

const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

/**
 * Class FileImageService
 * Работа с файлами на сервере (изображения)
 *
 * @package src/services
 */
class FileImageService {
    /**
     * Получить список всех файлов
     *
     * @return {Promise<File>}
     * Список всех файлов на сервере, информация по загрузке диска
     */
    async getAll() {
        return File.findAll({
            nest: true,
            where: {
                type: ['image', 'img'],
            },
            include: {
                as: 'author',
                model: User,
                attributes: ['name'],
            },
            attributes: ['id', 'name', 'src', 'type', 'weight', 'expires', 'isUnlimited', 'format', 'resolution', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
    }

    /**
     * Загрузить одно или более изображений в хранилище файлов
     *
     * @param params Входные POST параметры
     * @return {Promise<File>} Загруженное (-ые) изображение (-я)
     */
    async addList(params) {
        const { user } = params;
        const files = params?.files;

        if (!files) {
            throw new Error('Файлы отсутствуют');
        }

        const resolution = params.body.resolution.split(',');
        for (let i in files) {
            let nameExt = files[i].originalname.split('.');
            let changedName = files[i].path.split('/').slice(-1);

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 21);

            await File.create({
                name: nameExt.slice(0, -1).join('.'),
                format: nameExt.pop(),
                src: process.env.UPLOAD_PATH_IMAGINE + '/' + changedName,
                type: files[i].fieldname,
                weight: Math.round((files[i].size / (1024 * 1024)) * 100) / 100 + ' МБ',
                resolution: resolution[i],
                authorId: user.userId,
                expires: currentDate,
                isUnlimited: false,
            });
        }

        return this.getAll();
    }

    /**
     * Внести изменения в параметры хранения файла
     *
     * @param params Входные POST параметры
     * @return {Promise<File>} Результат операции
     */
    async updateOne(params) {
        const { user } = params;
        const { id, expires, isUnlimited } = params?.body;

        const file = await File.findOne({
            where: {
                id: id,
            },
        });

        if (!file.id) {
            throw new Error('Файл не найден');
        } else if (file.authorName !== user.name && user.role !== 'admin') {
            throw new Error('Менять чужие файлы может только администратор');
        }

        return File.update(
            {
                isUnlimited: isUnlimited,
                expires: isUnlimited ? '9999-01-01' : expires,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    }

    /**
     * Удалить изображение с сервера
     *
     * @param params Входные DELETE параметры
     * @return number Статус операции
     */
    async deleteOne(params) {
        const { user } = params;
        const { id } = params?.body;

        const file = await File.findOne({
            where: {
                id: id,
            },
        });

        if (!file.id) {
            throw new Error('Файл не найден');
        }

        if (!['admin'].includes(user.role) && user.name !== file.authorName) {
            throw new Error('Удалять чужие файлы может только администратор');
        }

        fs.unlinkSync(path.join(process.env.UPLOAD_PATH_ORIGIN, '/', file.src.split('/')[1]));

        return await File.destroy({
            where: {
                id: file.id,
            },
        });
    }

    /**
     * Процедура очистки просроченных по актуальности файлов
     *
     * @returns {Promise<void>}
     */
    async clearExpires() {
        const currentDate = new Date(Date.now());

        const files = await File.findAll({
            where: {
                expires: {
                    [Op.lt]: currentDate,
                },
            },
            attributes: ['name', 'src'],
        });

        for (let file of files) {
            fs.unlinkSync(path.join(process.env.UPLOAD_PATH_ORIGIN, '/', file.src.split('/')[1]));
        }

        return File.destroy({
            where: {
                expires: {
                    [Op.lt]: currentDate,
                },
            },
        });
    }
}

module.exports = new FileImageService();
