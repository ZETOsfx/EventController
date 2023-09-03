require('dotenv').config();

const PORT = process.env.SERVER_PORT;

const http = require('http');
const express = require('express');
// const cron = require('node-cron');

const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const session = require('express-session');
const history = require("connect-history-api-fallback");

const app = express();
const server = http.createServer(app);

const getSocket = require('./socket');
const io = getSocket(server);

app.set('view-engine', 'ejs');

server.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));   // Parsing requests
    
const corsOptions = {
    origin:'http://localhost:3000', 
    credentials: true,            // access-control-allow-credentials: true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(
    session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        cookie: { maxAge: Number(process.env.COOKIE_LIVE), theme: "light" },
        resave: false,
    })
);
    
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/js/vue.js', (req, res) => {
    res
        .header("Content-Type", "application/javascript; charset=UTF-8")
        .sendFile(`${__dirname.substring(0, __dirname.length - 7)}/client/dist/main.js`);
});

app.use(history({ verbose: true, index: '/', history: true }));

app.get("/", function(req, res) {
    res.render(__dirname + '/app.ejs', {
        API_URL: process.env.API_URL,
        NODE_ENV: process.env.NODE_ENV,
    });
});

const getRoutes = require('./src/router');
getRoutes(app);