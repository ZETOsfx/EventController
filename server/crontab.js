const cron = require('node-cron');

startCron = () => {
    cron.schedule('* * * * * *', function () {
        console.log('Crontab working');
    }, {
        name: 'test',
        scheduled: false,
        timezone: "Europe/Moscow",
    });

    cron.getTasks().forEach((task) => {
         console.log(task.options.name);
    });
}

module.exports = startCron;
