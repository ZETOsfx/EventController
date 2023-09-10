const authMiddleware = require('./middleware/authMiddleware');

function getRoutes(app)
{
    /** Работа с аккаунтами пользователей */
    app.get('/accounts/list', require("./handlers/accounts/accountListHandler"));
    app.post('/accounts/add', require("./handlers/accounts/addAccountHandler"));
    app.post('/accounts/update', require("./handlers/accounts/updateAccountHandler"));
    app.delete('/accounts/delete', require("./handlers/accounts/deleteAccountHandler"));

    /** Авторизация пользователей */
    app.post('/auth', require("./handlers/auth/authHandler"));


}

module.exports = getRoutes;