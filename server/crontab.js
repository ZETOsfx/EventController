const cron = require('node-cron');
const noteService = require('./src/services/NoteService');
const fileImgService = require('./src/services/FileImageService');

startCron = () => {
    cron.schedule(
        '0 0 * * *',
        async function () {
            await noteService.clearExpires();
            await fileImgService.clearExpires();
        },
        {
            name: 'clear-expires',
            scheduled: true,
            timezone: 'Europe/Moscow',
        }
    );

    // cron.getTasks().forEach((task) =>
    // {
    //     console.log(task.options);
    // });
};

module.exports = startCron;
