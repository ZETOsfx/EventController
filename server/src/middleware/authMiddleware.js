require('dotenv').config();

const jwt = require('jsonwebtoken');

/**
 * Проверка наличия существующего валидного токена доступа.
 *
 * @param req Тело запроса (заголовки, параметры)
 * @param res Ответ сервера
 * @param next
 * @return { * } Переход к обработчику запроса или перенаправление на авторизацию.
 */
const verifyToken = (req, res, next) =>
{
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        req.user = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(401).redirect('/login');
    }

    return next();
};

module.exports = verifyToken;