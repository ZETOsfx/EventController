const authMwFactory = require('./middleware/authMiddlewareFactory');
const authMw = authMwFactory(true);
const liteMw = authMwFactory(false);

const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH_ORIGIN);
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + '--' + file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine });

const getRoutes = app => {
    /**
     * Операции с аккаунтами пользователей
     * -- стандартные CRUD-операции
     * -> Доступны только администратору
     */
    app.get('/accounts', authMw, require('./handlers/accounts/accountListHandler'));
    app.post('/accounts/add', authMw, require('./handlers/accounts/addAccountHandler'));
    app.post('/accounts/update', authMw, require('./handlers/accounts/updateAccountHandler'));
    app.delete('/accounts/delete', authMw, require('./handlers/accounts/deleteAccountHandler'));

    /**
     * Авторизация пользователей
     * -> Доступно всем
     *
     * @param { login, password }
     * @return { token, unread, name, role }
     */
    app.post('/auth', liteMw, require('./handlers/authHandler'));

    /**
     * Операции с уведомлениями
     * 1. Cast - транслируемые уведомления (видны всем)
     * 2. Read - стандартный способ просмотра всех уведомлений для авторизованных пользователей
     * 3. Add  - добавление нового уведомления
     * 4. Delete - удаление объявления
     * -> Доступны всем авторизованным, кроме редактора
     */
    app.get('/notes/cast', liteMw, require('./handlers/notes/castNotesHandler'));
    app.get('/notes/read', authMw, require('./handlers/notes/readNotesHandler'));
    app.post('/notes/add', authMw, require('./handlers/notes/addNoteHandler'));
    app.delete('/notes/delete', authMw, require('./handlers/notes/deleteNoteHandler'));

    /**
     * Отправка уведомлений об ошибках
     * -> Доступно каждому авторизованному пользователю
     */
    app.post('/report', authMw, require('./handlers/reportHandler'));

    /**
     * Получение списка транслируемых событий
     * -> Доступно всем
     */
    app.get('/cast', liteMw, require('./handlers/castHandler'));
    app.get('/sync', liteMw, require('./handlers/syncHandler'));

    /**
     * Операции по настройке трансляции
     * -> Доступны всем авторизованным, кроме менеджера
     */
    app.get('/setting/all', authMw, require('./handlers/setting/getWorkingDataHandler'));

    app.get('/setting/program', authMw, require('./handlers/setting/Program/getProgramHandler'));
    app.post('/setting/program', authMw, require('./handlers/setting/Program/addProgramHandler'));
    app.post('/setting/program/save', authMw, require('./handlers/setting/Program/updateProgramHandler'));
    app.delete('/setting/program', authMw, require('./handlers/setting/Program/deleteProgramHandler'));

    app.get('/setting/compose', authMw, require('./handlers/setting/Compose/getComposeHandler'));
    app.post('/setting/compose', authMw, require('./handlers/setting/Compose/addComposeHandler'));
    app.delete('/setting/compose', authMw, require('./handlers/setting/Compose/deleteComposeHandler'));
    app.post('/setting/compose/update', authMw, require('./handlers/setting/Compose/updateComposeHandler'));
    app.post('/setting/compose/send', authMw, require('./handlers/setting/Compose/sendComposeHandler'));
    app.post('/setting/compose/recall', authMw, require('./handlers/setting/Compose/recallComposeHandler'));

    /**
     * Операции по модерации трансляции
     * -> Доступны модератору и администратору
     */
    app.get('/control', authMw, require('./handlers/control/getAllRequestsHandler'));
    app.post('/control/toggle', authMw, require('./handlers/control/toggleRequestHandler'));
    app.post('/control/refund', authMw, require('./handlers/control/refundRequestHandler'));
    app.post('/control/update', authMw, require('./handlers/control/updateRequestHandler'));
    app.post('/control/active', authMw, require('./handlers/control/activateRequestHandler'));

    /**
     * Операции над файлами в хранилище
     * -> Все авторизованные имеют полный доступ, но только к своим ресурсам
     * -> Администратор имеет доступ ко всем возможностям
     */
    app.get('/files/img', authMw, require('./handlers/files/img/getAllHandler'));
    app.post('/files/img/add', authMw, upload.array('image', 10), require('./handlers/files/img/addHandler'));
    app.post('/files/img/update', authMw, require('./handlers/files/img/updateHandler'));
    app.delete('/files/img/delete', authMw, require('./handlers/files/img/deleteHandler'));

    /**
     * Данные о файловом хранилище сервера
     * -> Доступно всем авторизованным
     */
    app.get('/storage', authMw, require('./handlers/files/storageDataHandler'));
};

module.exports = getRoutes;
