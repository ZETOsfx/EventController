require('dotenv').config();

const exec = require('child_process').exec;

/**
 * Class FileStorageService
 * Предоставление доплнительной информации о хранилище
 *
 * @package src/services
 */
class FileStorageService
{
    /**
     * Получить информацию по загруженности хранилища
     *
     * @return { status, data } Объем занятого ресурсами пространства на диске
     */
    getWorkload(req, res)
    {
        let fileStorageData = [];

        try {
            const state = exec('df -h ' + process.env.DISK_FREE + " | awk '{print $2, $3, $5}' | tail -n +2", (error, stdout, stderr) =>
            {
                fileStorageData = stdout.toString().split(' ');
                fileStorageData[2] = fileStorageData[2].split('\n')[0];

                res.status(200).json({
                    status: 'success',
                    data: fileStorageData,
                });
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                data: error.message,
            });
        }
    }
}

module.exports = new FileStorageService();