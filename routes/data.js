var _ = require('lodash');
var express = require('express');
var router = express.Router();
var models = require('../models');
var logging = require('../lib/logging');
var encryption = require('../lib/encryption');
var asyncWrap = require('../asyncWrap');

router.post('/', asyncWrap(async (req, res) => {

  if (!req.body || !req.body.id || !/^([0-9a-z\-]+)$/i.test(req.body.id) || !req.body.encryption_key || !req.body.value) {
    return res.status(400).send({
      status: 'fail',
      data: {
        errors: [
            ...(!req.body || !req.body.id || !/^([0-9a-z\-]+)$/i.test(req.body.id) ?
                ['You must provide an id that consists of valid characters.'] : []),
           ...(!req.body.encryption_key ? ['You must provide an encryption key.'] : []),
           ...(!req.body.value ? ['You must provide the value to store.'] : [])
        ]
      }
    });
  }

  let data = JSON.stringify({ value: req.body.value, type: (typeof req.body.value) });

  await models.DataItem.upsert({
    key: req.body.id,
    value: encryption.encrypt(data, req.body.encryption_key)
  });

  return res.send({
    status: 'success'
  });
}));

router.get('/', asyncWrap(async (req, res) => {

  if (!req.query || !req.query.id || !/^([0-9a-z\-\*]+)$/i.test(req.query.id) || !req.query.encryption_key) {
    return res.status(400).send({
      status: 'fail',
      data: {
        errors: [
          ...(!req.query || !req.query.id || !/^([0-9a-z\-\*]+)$/i.test(req.query.id)
              ? ['You must provide an id that consists of valid characters or the wildcard *.'] : []),
          ...(!req.query.encryption_key ? ['You must provide an encryption key.'] : [])
        ]
      }
    });
  }

  let items = await models.DataItem.findAll({
    where: {
      key: { [models.Sequelize.Op.like]: req.query.id.replace(/\*/i, '%') }
    },
    limit: 50,
    raw: true,
    order: [['key', 'ASC']]
  });

  let decryptedItems = await Promise.all(items.map(async item => {

    try {
      let decryptedValue = encryption.decrypt(item.value, req.query.encryption_key);
      return { id: item.key, ...JSON.parse(decryptedValue) };

    } catch {
      await logging.markRetrievalError(item, req);
      return null;
    }
  }).filter(item => item));

  return res.send({
    status: 'success',
    data: { items: decryptedItems.filter(i => i) }
  });
}));

module.exports = router;
