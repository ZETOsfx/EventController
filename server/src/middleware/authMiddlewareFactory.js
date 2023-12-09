require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Проверка наличия мертвого / невалидного токена.
 *
 * @param needsAuth Флаг необходимости авторизации
 * @return { * } Переход к обработчику запроса или перенаправление на авторизацию
 */
const authMiddlewareFactory = needsAuth => {
    /**
     * @param req Тело запроса (заголовки, параметры)
     * @param res Ответ сервера
     * @param next Пропуск к выполнению операции
     * @return { * } Переход к обработчику запроса или перенаправление на авторизацию
     */
    return function (req, res, next) {
        const token = req.headers['x-access-token'];
        let errorCode = -1;

        if (token === 'undefined') {
            if (!needsAuth) {
                return next();
            } else {
                return res.status(403).send('A token is required for authentication');
            }
        }

        jwt.verify(token, process.env.TOKEN_KEY, function (err, decoded) {
            if (err) {
                const errorName = err.name;
                switch (errorName) {
                    case 'TokenExpiredError':
                        errorCode = 401;
                        break;
                    default:
                        errorCode = 500;
                }
            }
            req.user = decoded;
        });

        switch (errorCode) {
            case 401:
                return res.status(401).send('A token has expired');
            case 500:
                return res.status(500).send('Unidentified token error');
            default:
                return next();
        }
    };
};

module.exports = authMiddlewareFactory;
