var express = require('express');
var router = express.Router();
var con = require('../config/connection');

/* GET home page. */
router.get('/add', function (req, res, next) {
  res.render('transactions/add', {
    title: 'Add Transactions Page',
    error: false,
    messages: ''
  });
});
router.post('/add', function (req, res, next) {
  var pl = req.body.platnomor;
  var sql = `SELECT * FROM transaksi WHERE platnomor = ${pl}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    var sql2 = `INSERT INTO transaksi (platnomor) VALUES ('${pl}')`;
    if (result.length > 0 && result[0].keluar == null) {
      res.render('transactions/add', {
        title: 'Add Transactions Page',
        error: true,
        messages: 'Exit already out'
      });
    } else {
      con.query(sql2, function (err2) {
        if (err2) throw err2;
        res.render('transactions/add', {
          title: 'Add Transactions Page',
          error: false,
          messages: 'Insert Success'
        });
      });
    }
  });
});

router.get('/out/:id/:id_transactions', function (req, res, next) {
  var sql = `SELECT * FROM pengguna WHERE platnomor = ${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      var registered = new Date(result[0].mulai).getTime();
      var expired = new Date(result[0].berakhir).getTime();

      if (registered >= Date.now() && expired <= Date.now()) {
        var sql2 = `UPDATE transaksi SET total = 0 WHERE id = ${req.params.id_transactions}`;
        con.query(sql2, function (err2, result) {
          if (err2) throw err2;
          res.redirect('/');
        });
      } else {
        var sql2 = `SELECT  id, platnomor, DATE_FORMAT(masuk, "%Y-%m-%d") As masuk, keluar, total FROM transaksi WHERE id = ${req.params.id_transactions} ORDER BY masuk LIMIT 1`;
        con.query(sql2, function (err2, result2) {
          if (err2) throw err2;
          var checkin = new Date(result2[0].masuk).getTime();
          var checkout = Date.now();
         var hours = (checkout - checkin) / 3600;
          var total = 3000 * (hours > 0 && hours < 1 ? 1 : Math.round(hours));
          var sql3 = `UPDATE transaksi SET total = ${total} AND SET checkout  WHERE id = ${req.params.id_transactions}`;
          con.query(sql3, function (err3) {
            if (err3) throw err3;
            res.redirect('/');
          });
        });
      }
    } else {
      var sql2 = `SELECT * FROM transaksi WHERE id = ${req.params.id_transactions} ORDER BY masuk LIMIT 1`;
      con.query(sql2, function (err2, result2) {
        if (err2) throw err2;
        var checkin = new Date().getTime();
        var checkout = Date.now();
        var hours = (checkout - checkin) / 3600;
        var total = 3000 * (hours > 0 && hours < 1 ? 1 : Math.round(hours));

        var sql3 = `UPDATE transaksi SET total = ${total}  WHERE id = ${req.params.id_transactions}`;
        con.query(sql3, function (err, result3) {
          if (err) throw err;
          res.redirect('/');
        });
      });
    }
  });
});

module.exports = router;