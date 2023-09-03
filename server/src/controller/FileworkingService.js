require('dotenv').config();
const fs = require('fs');
const path = require('path');              
const exec = require('child_process').exec;

const db = require('../../config/dbConfig')['migrations'];

class fileworkingService {
        // Get all data
    async getFiles(req, res) {

        const files = await db('resource_data').select('*');

        let fileStorageData = [];
            // DATA about storage 
        const child = exec('df -h ' + process.env.DISK_FREE + " | awk '{print $2, $3, $5}' | tail -n +2", (error, stdout, stderr) => {
            fileStorageData = stdout.toString().split(' ');
            fileStorageData[2] = fileStorageData[2].split('\n')[0];
            return res.status(200).json({ files, fileStorageData });
        });
    }
        /**
         * @param { * } req     List of files (images) loaded to server 
         * @param { * } res     XD
         * @param { * } next    MW for error -> catching
         * @returns HZ
         */
    async addImg(req, res, next) {
       
        const files = req.files;
        
        if (!files) {
            const error = new Error('Please choose files');
            error.httpStatusCode = 400;
            return next(error);
        }

        for (let i in files) {
            let nameext = files[i].originalname.split('.');
            let changed_name = files[i].path.split('/').slice(-1);
            console.log(changed_name);
            await db('resource_data').insert({
                name:   nameext[0],
                format: nameext[1],
                src:    process.env.UPLOAD_PATH_IMAGINE + '/' + changed_name,
                type:   files[i].fieldname,
                weight: Math.round(files[i].size / (1024 * 1024) * 100) / 100 + ' МБ',
                author: req.user.name,
                actual: "9999-01-01",
                edit: false,
                unlim: true
            });
        }

        return res.status(200).json(files);
    }

        /**
         * 
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
    async updateImg(req, res) {

        // const { data } = req?.body;
        res.end();
    }

        /** 
         * @param { id }    req  id of resource needed to delete 
         * @param { * }     res     
         * @returns callback for client
         */
    async deleteImg(req, res) {

        const id = req.body?.id;
        const fileData = await db('resource_data').select('*').where({ id });

        if (fileData[0] === undefined)
            return res.status(400).json({ cb: 'Файл не найден.' });
    
        fs.unlinkSync(path.join(process.env.UPLOAD_PATH_ORIGIN, '/', fileData[0].src.split('/')[1]));
        await db('resource_data').where({ id }).del();
        
        return res.status(200).json({ cb: 'ok' });
    }
}

module.exports = new fileworkingService();