const path = require('path');
const request = require('supertest');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.test')
});

const app = require('../../bin/www');
const models = require('../../models');

global.methods = {
    post: (url, body) => {
        const httpRequest = request.agent(app).post(url);
        httpRequest.send(body);
        httpRequest.set('Accept', 'application/json');

        return httpRequest;
    },

    get: (url, headers) => {
        const httpRequest = request.agent(app).get(url);
        httpRequest.set('Accept', 'application/json');

        Object.keys(headers || {}).forEach(header => {
            httpRequest.set(header, headers[header]);
        });

        return httpRequest;
    }
};


global.beforeAll((done) => {
    app.on("appStarted", async function() {

        //clear all tables from test-db
        await models.sequelize.sync({ force: true, alter: true });
        await models.RetrievalLog.destroy({ where: {} });
        await models.DataItem.destroy({ where: {} });

        done();
    });
});


global.afterAll((done) => {
    app.close(done);
});
