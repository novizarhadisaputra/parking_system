var express = require('express');
var router = express.Router();
var con = require('../config/connection');

/* GET home page. */
router.get('/', function (req, res, next) {
  con.query("SELECT * FROM transaksi WHERE DAY(masuk) = DAY(CURRENT_DATE()) AND MONTH(masuk) = MONTH(CURRENT_DATE()) AND YEAR(masuk) = YEAR(CURRENT_DATE())", function (err, result, fields) {
    if (err) throw err;
    res.render('home', {
      title: 'Parking System',
      data: result
    });
  });

});

module.exports = router;