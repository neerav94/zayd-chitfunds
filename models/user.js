var database = require('../config/database');

module.exports.getSubscribedGroups = function (number) {
    return new Promise((resolve, reject) => {
        database.connection.query('SELECT DISTINCT group_name FROM subscribers WHERE number =?', [number], (error, results, fields) => {
            var response = {}
            if (results.length > 0) {
                var groupNames = ""
                for (var i in results) {
                    groupNames += results[i].group_name + ", "
                }
                groupNames = groupNames.trimRight();
                groupNames = groupNames.slice(0, -1);
                response["name"] = groupNames
                resolve(response)
            } else {
                response["name"] = ""
                resolve(response)
            }
        })
    })
}

module.exports.updateUserInfo = function (userData, id) {
    return new Promise((resolve, reject) => {
        database.connection.query('UPDATE users SET name=?, father_husband_name=?, dob=?, age=?, gender=?, email=?, other_number=?, residential_address=?, pan=?, aadhar=?, nominee=?, dependents=?, occupation=?, business_name=?, office_address=?, income=?, first_reference=?, second_reference=? WHERE id = ?', [[userData.name], [userData.father_husband_name], [userData.dob], [userData.age], [userData.gender], [userData.email], [userData.other_number], [userData.residential_address], [userData.pan], [userData.aadhar], [userData.nominee], [userData.dependents], [userData.occupation], [userData.business_name], [userData.office_address], [userData.income], [userData.first_reference], [userData.second_reference], [id]], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports.getAllUsers = function (callback) {
    database.connection.query('SELECT * FROM users WHERE role = 0', callback)
}

module.exports.getUserById = function (id, callback) {
    database.connection.query('SELECT * FROM users WHERE id = ?', [id], callback)
}