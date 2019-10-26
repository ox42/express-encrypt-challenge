const models = require('../models');

async function markRetrievalError(item, req) {

    await models.RetrievalLog.create({
        info: 'Failed to decrypt item value. Wrong key.',
        DataItemId: item.id,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        occurredOn: new Date()
    });
}

module.exports = { markRetrievalError };
