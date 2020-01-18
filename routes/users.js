var express = require('express');
var router = express.Router();
var con = require('../config/connection');

/* GET users listing. */
router.get('/add', function (req, res, next) {
  res.render('users/add', {
    title: 'Add Users Page',
    error: false,
    messages: ''
  });
});
router.post('/add', function (req, res, next) {
  var pl = req.body.platnumber;
  var nik = req.body.nik;
  var name = req.body.name;
  var password = req.body.password;
  var kontak = req.body.kontak;

  var sql = `SELECT * FROM kendaraan WHERE platnomor = ${pl}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    var sql2 = `INSERT INTO pengguna (nik, nama, platnomor, kontak, status, berakhir) VALUES ('${nik}', '${name}','${pl}', '${kontak}', 1 , DATE_ADD(NOW(), INTERVAL 1 MONTH))`;
    if (result.length > 0) {
      res.render('users/add', {
        title: 'Add Users Page',
        error: true,
        messages: 'User already'
      });
    } else {
      console.log('sql2 :', sql2);
      con.query(sql2, function (err2, result) {
        if (err2) throw err2;
        res.render('users/add', {
          title: 'Add Users Page',
          error: false,
          messages: 'Insert Success'
        });
      });
    }
  });
});

module.exports = router;