var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "parkir"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.on('error', function (err) {
  console.log("[mysql error] ", err);
});

module.exports = con;