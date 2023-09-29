require('dotenv').config();

const { File } = require('../../models');

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

/**
 * Class FileService
 * Работа с файлами на сервере
 *
 * @package src/services
 */
class FileService
{
    /**
     * Получить список всех файлов
     *
     * @return {Array<Promise<File>>, fileStorageData}
     * Список всех файлов на сервере, информация по загрузке диска
     */
    async getAll()
    {
        let fileStorageData = [];

        const child = exec('df -h ' + process.env.DISK_FREE + " | awk '{print $2, $3, $5}' | tail -n +2", (error, stdout, stderr) =>
        {
            fileStorageData = stdout.toString().split(' ');
            fileStorageData[2] = fileStorageData[2].split('\n')[0];

            return {
                files: File.findAll(),
                fileStorageData,
            };
        });
    }

    /**
     * Загрузить одно или более изображений в хранилище файлов
     *
     * @param params Входные POST параметры
     * @return Array<Promise<File>> Загруженное (-ые) изображение (-я)
     */
    async addImages(params)
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
     * Удалить изображение с сервера
     *
     * @param params Входные DELETE параметры
     * @return number Статус операции
     */
    async deleteOneImage(params)
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
        })[0];
    }
}

module.exports = new FileService();