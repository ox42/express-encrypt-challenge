var express = require('express');
var router = express.Router();
var asyncWrap = require('../asyncWrap');

/* GET home page. */
router.get('/', asyncWrap(async (req, res) => {
  res.render('index');
}));

module.exports = router;
