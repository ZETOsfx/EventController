require('dotenv').config();

const { File, User } = require('../../models');

const fs = require('fs');
const path = require('path');

/**
 * Class FileService
 * Работа с файлами на сервере
 *
 * @package src/services
 */
class FileImageService
{
    /**
     * Получить список всех файлов
     *
     * @return {Array<Promise<File>>, fileStorageData}
     * Список всех файлов на сервере, информация по загрузке диска
     */
    async getAll()
    {
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
            attributes: ['id', 'name', 'src', 'type', 'weight', 'expires', 'isUnlimited', 'format'],
        });
    }

    /**
     * Загрузить одно или более изображений в хранилище файлов
     *
     * @param params Входные POST параметры
     * @return Array<Promise<File>> Загруженное (-ые) изображение (-я)
     */
    async addList(params)
    {
        const { user } = params;
        const files = params?.files;

        if (!files) {
            throw new Error('Файлы отсутствуют');
        }

        for (let i in files) {
            let nameExt = files[i].originalname.split('.');
            let changedName = files[i].path.split('/').slice(-1);

            await File.create({
                name: nameExt[0],
                format: nameExt[1],
                src: process.env.UPLOAD_PATH_IMAGINE + '/' + changedName,
                type: files[i].fieldname,
                weight: Math.round(files[i].size / (1024 * 1024) * 100) / 100 + ' МБ',
                authorName: user.name,
                expires: "9999-01-01",
                isUnlimited: true,
            });
        }

        return this.getAll();
    }

    /**
     * Внести изменения в параметры хранения файла
     * 
     * @param params Входные POST параметры
     * @return number Результат операции 
     */
    async updateOne(params)
    {
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

        return await File.update({
            isUnlimited: isUnlimited,
            expires: (isUnlimited) ? "9999-01-01" : expires,
        }, {
            where: {
                id: id,
            },
        });
    }

    /**
     * Удалить изображение с сервера
     *
     * @param params Входные DELETE параметры
     * @return number Статус операции
     */
    async deleteOne(params)
    {
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
}

module.exports = new FileImageService();