var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('location_map', { title: 'Location Map' });
});

module.exports = router;
