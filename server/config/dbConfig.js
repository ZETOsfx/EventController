require('dotenv').config();

const knex = require('knex');

const config = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST_MIG,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.MAIN_DB
    }
});

module.exports = config;