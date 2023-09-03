require('dotenv').config();

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).redirect('/login');
    }

    return next();
};


module.exports = verifyToken;