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
     * @return { occupiedSpace } Объем занятого ресурсами пространства на диске
     */
    async getWorkload()
    {
        let fileStorageData = [];

        const child = exec('df -h ' + process.env.DISK_FREE + " | awk '{print $2, $3, $5}' | tail -n +2", (error, stdout, stderr) =>
        {
            fileStorageData = stdout.toString().split(' ');
            fileStorageData[2] = fileStorageData[2].split('\n')[0];

            return {
                occupiedSpace: fileStorageData,
            };
        });
    }
}

module.exports = new FileStorageService();