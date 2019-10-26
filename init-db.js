require('dotenv').config();
const models = require('./models');

Promise.resolve()
    .then(async() => {

        //create database tables
        await models.sequelize.sync();
    });
