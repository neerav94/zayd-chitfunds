var database = require('../config/database');
var bcrypt = require('bcrypt');

module.exports.checkUserExist = function (number) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM users WHERE number = ?', [number], function (error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        if (results.length > 0) {
          var response = {}
          response.status = 0;
          response.user = results;
          return resolve(response)
        } else {
          var response = {}
          response.status = 1;
          response.user = results;
          return resolve(response);
        }
      }
    })
  });
}

module.exports.getUser = function(number, password, databasePassword) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM users WHERE number = ?', [number], function(error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        bcrypt.compare(password, databasePassword, function (err, ress) {
          if(!ress) {
            // password does not match
            var status = 0;
            return resolve(status);
          } else {
            // password matches, successfully login
            var status = 1;
            return resolve(status);
          }
        }); 
      }
    })
  })
}

module.exports.addNewUser = function (newUser, callback) {
  database.connection.query('INSERT INTO users SET ?', newUser, callback)
}