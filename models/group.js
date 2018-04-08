var database = require('../config/database');

module.exports.checkGroupExist = function (groupName) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM groupinfo WHERE grp_name = ?', [groupName], function(error, results, fields) {
      if(error) {
        return reject(error);
      } else {
        if(results.length > 0) {
          var response = {}
          response.status = 1;
          return resolve(response)
        } else {
          var response = {}
          response.status = 0;
          return resolve(response)
        }
      }
    })
  })
}

module.exports.getAllGroups = function(callback) {
  database.connection.query('SELECT * FROM groupinfo', callback)
}

module.exports.createNewGroup = function (newGroup, callback) {
  database.connection.query('INSERT INTO groupinfo SET ?', newGroup, callback)
}