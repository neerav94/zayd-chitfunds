// logic part
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

module.exports.getAdmin = function () {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM users WHERE role = 1', function (error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        return resolve(results)
      }
    })
  })
}

module.exports.getPassword = function(number) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT password from users WHERE number = ?', [number], function(error, results, fields) {
      if(error) {
        reject(error)
      } else if(results.length === 0) {
        var response = {}
        response["status"] = false;
        response["data"] = ''
        resolve(response)
      } else if(results.length > 0) {
        var response = {}
        response["status"] = true;
        response["data"] = results[0].password
        resolve(response)
      }
    })
  })
}

module.exports.updateNumber = function(oldNumber, newNumber) {
  return new Promise((resolve, reject) => {
    database.connection.query('UPDATE users SET number = ? WHERE number = ?', [[newNumber], [oldNumber]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        database.connection.query('SELECT * FROM subscribers WHERE number = ?', [oldNumber], function(error, results, fields) {
          if(error) {
            return reject(error)
          } else if(results.length == 0) {
            resolve(true)
          } else if(results.length > 0) {
            database.connection.query('UPDATE subscribers SET number = ? WHERE number = ?', [[newNumber], [oldNumber]], function(error, results, fields) {
              if(error) {
                reject(error)
              } else {
                resolve(true)
              }
            })
          }
        })
      }
    })
  })
}

module.exports.updatePassword = function(newPassword, number) {
  return new Promise((resolve, reject) => {
    database.connection.query('UPDATE users SET password = ? WHERE number = ?', [[newPassword], [number]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else{
        var response = {}
        response["status"] = true;
        resolve(response);
      }
    })
  })
}

module.exports.forgotPassword = function(password, number) {
  return new Promise((resolve, reject) => {
    database.connection.query('UPDATE users SET password = ? WHERE number = ?', [[password], [number]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        resolve(true);
      }
    })
  })
}

module.exports.deleteAdmin = function (id) {
  return new Promise((resolve, reject) => {
    database.connection.query('DELETE FROM users WHERE id= ?', [id], function (error, results, fields) {
      if (error) {
        return reject(error)
      } else {
        database.connection.query('SELECT * FROM users WHERE role = 1', function (error, results, fields) {
          if (error) {
            return reject(error);
          } else {
            return resolve(results)
          }
        })
      }
    })
  })
}

module.exports.isSuperAdmin = function (number) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT role FROM users WHERE number = ?', [number], function (error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    })
  });
}

module.exports.getUser = function (number, password, databasePassword) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM users WHERE number = ?', [number], function (error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        bcrypt.compare(password, databasePassword, function (err, ress) {
          if (!ress) {
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