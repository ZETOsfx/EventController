const authMw = require("./middleware/authMiddleware");
const EventController = require("./controller/EditorService");

function getRoutes(app)
{
    /** Работа с аккаунтами пользователей */
    app.get('/accounts/list', authMw, require("./handlers/accounts/accountListHandler"));
    app.post('/accounts/add', authMw, require("./handlers/accounts/addAccountHandler"));
    app.post('/accounts/update', authMw, require("./handlers/accounts/updateAccountHandler"));
    app.delete('/accounts/delete', authMw, require("./handlers/accounts/deleteAccountHandler"));

    /** Авторизация пользователей */
    app.post('/auth', require("./handlers/authHandler"));

    /** Работа с уведомлениями */
    app.get('/notes/cast', require('./handlers/notes/castNotesHandler'));
    app.get('/notes/read', authMw, require('./handlers/notes/readNotesHandler'));
    app.post('/notes/add', authMw, require('./handlers/notes/addNoteHandler'));
    app.delete('/notes/delete', authMw, require('./handlers/notes/deleteNoteHandler'));

    /** Отправка уведомлений об ошибках */
    app.post('/report', authMw, require('./handlers/reportHandler'));

    /** Работа по настройке трансляции */
    app.get('/setting/all', require('./handlers/setting/getWorkingDataHandler'));

    app.get('/setting/program', authMw, require('./handlers/setting/Program/getProgramHandler'));
    app.post('/setting/program', authMw, require('./handlers/setting/Program/addProgramHandler'));
    app.post('/setting/program/save', authMw, require('./handlers/setting/Program/updateProgramHandler'));
    app.delete('/setting/program', authMw, require('./handlers/setting/Program/deleteProgramHandler'));

    app.get('/setting/compose', authMw, require('./handlers/setting/Compose/getComposeHandler'));
    app.post('/setting/compose', authMw, require('./handlers/setting/Compose/addComposeHandler'));
    app.delete('/setting/compose', authMw, require('./handlers/setting/Compose/deleteComposeHandler'));
    app.post('/setting/compose/update', authMw, require('./handlers/setting/Compose/updateComposeHandler'));
    app.post('/setting/compose/send', authMw, require('./handlers/setting/Compose/sendComposeHandler'));
    // app.get('/setting/compose/program', authMw, EventController.eventsFromTmpInCompose);

    /** Получение событий для вывода на трансляцию */
    app.get('/cast', EventController.getEventsFormatJSON);
}

module.exports = getRoutes;