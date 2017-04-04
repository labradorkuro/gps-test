var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('plants_info', { title: 'Plants Infomation' });
});

module.exports = router;
