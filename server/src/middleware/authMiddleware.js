require('dotenv').config();

const jwt = require('jsonwebtoken');

/**
 * Проверка наличия существующего валидного токена доступа.
 *
 * @param req Тело запроса (заголовки, параметры)
 * @param res Ответ сервера
 * @param next Пропуск к выполнению операции
 * @return { * } Переход к обработчику запроса или перенаправление на авторизацию.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    jwt.verify(token, process.env.TOKEN_KEY, function (err, decoded) {
        if (err) {
            const errorName = err.name;
            switch (errorName) {
                case 'TokenExpiredError':
                    return res.status(401).send('A token has expired');
                default:
                    return res.status(500).send('Unidentified token error');
            }
        }
        req.user = decoded;
    });

    return next();
};

module.exports = verifyToken;
