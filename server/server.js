require('dotenv').config();

const PORT = process.env.SERVER_PORT || 5000;
const db = require('./models');

const http = require('http');
const express = require('express');
const path = require('path');

const cors = require('cors');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const session = require('express-session');
const history = require('connect-history-api-fallback');

const app = express();
const server = http.createServer(app);

app.set('view-engine', 'ejs');

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        optionSuccessStatus: 200,
    }),
    express.json({ limit: '10mb' }),
    express.static(path.join(__dirname, 'public')),
    express.urlencoded({ extended: false, limit: '10mb' }),
    favicon(path.join(__dirname, 'public', 'favicon.ico')),
    morgan(':method :url :status :res[content-length] - :response-time ms'),
    history({ verbose: true, index: '/', history: true }),
    session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        cookie: { maxAge: Number(process.env.COOKIE_LIVE), theme: 'light' },
        resave: true,
    })
);

app.get('/js/vue.js', (req, res) => {
    res.header('Content-Type', 'application/javascript; charset=UTF-8').sendFile(`${__dirname.substring(0, __dirname.length - 7)}/client/dist/main.js`);
});

app.get('/', (req, res) => {
    res.render(__dirname + '/app.ejs', {
        API_URL: process.env.API_URL,
        NODE_ENV: process.env.NODE_ENV,
    });
});

require('./socket')(server);
require('./src/router')(app);
require('./crontab')();

db.sequelize.sync().then(req => {
    server.listen(PORT, error => {
        error ? console.log(error) : console.log(`listening port ${PORT}`);
    });
});
