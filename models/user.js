var database = require('../config/database');

module.exports.getSubscribedGroups = function(number) {
    return new Promise((resolve, reject) => {
        database.connection.query('SELECT group_name FROM subscribers WHERE number =?', [number], (error, results, fields) => {
            var response = {}
            if(results.length > 0) {
                var groupNames = ""
                for(var i in results) {
                    groupNames += results[i].group_name + " "
                }
                response["name"] = groupNames
                resolve(response)
            } else {
                response["name"] = ""
                resolve(response)
            }
        })
    })
}

module.exports.getAllUsers = function(callback) {
    database.connection.query('SELECT * FROM users', callback)
}

module.exports.getUserById = function(id, callback) {
    database.connection.query('SELECT * FROM users WHERE id = ?', [id], callback)
}