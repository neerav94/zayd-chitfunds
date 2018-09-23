var mysql = require('mysql');

var connection  = mysql.createPool({
  connectionLimit : 50,
  connectTimeout: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// var connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });
// connection.connect(function (err) {
//   if (!err) {
//     console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME)
//     console.log("Database is connected");
//   } else {
//     console.log("Error while connecting with database");
//   }
// });
module.exports = {
  connection: connection,
  secret: process.env.DB_SECRET
};