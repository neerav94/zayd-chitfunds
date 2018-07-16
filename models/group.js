var database = require('../config/database');

function monthDiff1(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12 + 1;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

function monthDiff2(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

function setGroupData(results) {
  var currentDate = new Date();
  for (var i in results) {
    startDay = new Date(results[i].start_date)
    startDay = startDay.getDate() + "/" + (startDay.getMonth() + 1) + "/" + startDay.getFullYear() + " " + startDay.getHours() + ":" + startDay.getMinutes()
    results[i]["startDay"] = startDay
    if (results[i].start_date) {
      var months = -1;
      var startDate = new Date(results[i].start_date)
      if ((startDate.getDate() > currentDate.getDate()) || (startDate.getDate() == currentDate.getDate() && startDate.getHours() > currentDate.getHours())) {
        months = monthDiff2(startDate, currentDate)
        auctionMonth = new Date().getMonth()
        auctionDate = new Date(results[i].start_date)
        auctionDate.setMonth(auctionMonth)
        auctionDate = auctionDate.getDate() + "/" + (auctionDate.getMonth() + 1) + "/" + auctionDate.getFullYear() + " " + auctionDate.getHours() + ":" + auctionDate.getMinutes()
      } else if ((startDate.getDate() < currentDate.getDate()) || (startDate.getDate() == currentDate.getDate() && startDate.getHours() < currentDate.getHours())) {
        months = monthDiff1(startDate, currentDate)
        auctionMonth = new Date().getMonth()
        auctionDate = new Date(results[i].start_date)
        auctionDate.setMonth(auctionMonth)
        auctionDate = auctionDate.getDate() + "/" + (auctionDate.getMonth() + 2) + "/" + auctionDate.getFullYear() + " " + auctionDate.getHours() + ":" + auctionDate.getMinutes()
      }
      if (months > -1) {
        if (results[i].status) {
          results[i]["months"] = months
        } else {
          results[i]["months"] = months + 1
        }
      } else {
        results[i]["months"] = 0
      }
      results[i]["auction"] = auctionDate
    } else {
      results[i]["months"] = 0
      results[i]["auction"] = "- -"
    }
  }
  return results
}

module.exports.createNewGroup = function (newGroup, callback) {
  database.connection.query('INSERT INTO groupinfo SET ?', newGroup, callback)
}

module.exports.getAllGroups = function () {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM groupinfo', function (error, results, fields) {
      if (error) {
        return reject(error)
      } else {
        var groupData = setGroupData(results)
        return resolve(groupData)
      }
    })
  })
}

module.exports.getGroupByNumber = function(number) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM subscribers WHERE number = ? GROUP BY group_id', [number], function(error, results, fields) {
      if(error) {
        reject(error)
      } else {
        let groupIdArray = [];
        for(let i=0; i<results.length; i++) {
          groupIdArray.push(results[i].group_id)
        }
        resolve(groupIdArray);
      }
    })
  })
}

module.exports.getGroupById = function (id) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM groupinfo WHERE grp_id = ?', [id], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        var groupData = setGroupData(results)
        return resolve(groupData)
      }
    })
  })
}

module.exports.setDateForGroup = function (data, callback) {
  database.connection.query('UPDATE groupinfo SET start_date=? WHERE grp_id=?', [data["start"], data["id"]], callback)
}

module.exports.checkGroupExist = function (groupName) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM groupinfo WHERE grp_name = ?', [groupName], function (error, results, fields) {
      if (error) {
        return reject(error);
      } else {
        if (results.length > 0) {
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

module.exports.checkTokenExist = function(tokenNumber, groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM subscribers WHERE token = ? AND group_id = ?', [[tokenNumber], [groupId]], function(error, results, fields) {
      if(error) {
        var response = {}
        response["status"] = 0
        reject(response)
      } else {
        if(results.length > 0) {
          var response = {}
          response["status"] = 1
          resolve(response)
        } else {
          var response = {}
          response["status"] = 0
          resolve(response)
        }
      }
    })
  })
}

module.exports.getAllSubscribers = function(groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM subscribers WHERE group_id = ?', [groupId], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        return resolve(results)
      }
    })
  })
}

module.exports.subscribeUser = function(data, callback) {
  database.connection.query('INSERT INTO subscribers SET ?', data, callback)
}

module.exports.editActiveStatus = function(id, token, months) {
  return new Promise((resolve, reject) => {
    database.connection.query('UPDATE payments SET active = 0 WHERE group_id=? AND token=?', [[id], [token]], function(error, results, fields) {
      if(error) {
        reject(error)
      } else {
        database.connection.query('UPDATE subscribers SET active = 0, months=? WHERE group_id=? AND token=?', [[months], [id], [token]], function(error, results, fields) {
          if(error) {
            reject(error)
          } else {
            resolve(true)
          }
        })
      }
    })
  })
}

module.exports.removeUser = function(token, groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('DELETE FROM subscribers WHERE token = ? AND group_id = ?', [[token], [groupId]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        return resolve(true)
      }
    })
  })
}

module.exports.getGroupId = function(groupName, callback) {
  database.connection.query('SELECT grp_id FROM groupinfo WHERE grp_name = ?', [groupName], callback)
}

module.exports.getDailyCollection = function(startDate, endDate) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT SUM(amount) AS amount FROM payments WHERE payment_date >= ? AND payment_date <= ?', [[startDate], [endDate]], function(error, results, fields) {
      if(error) {
        var response = {};
        response["status"] = false;
        response["message"] = error
        reject(response)
      } else {
        var response = {};
        response["status"] = true;
        response["message"] = results[0].amount;
        resolve(response);
      }
    })
  })
}

module.exports.getWeeklyCollection = function(startDate, endDate) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT SUM(amount) AS amount FROM payments WHERE payment_date >= ? AND payment_date <= ?', [[startDate], [endDate]], function(error, results, fields) {
      if(error) {
        var response = {};
        response["status"] = false;
        response["message"] = error
        reject(response)
      } else {
        var response = {};
        response["status"] = true;
        response["message"] = results[0].amount;
        resolve(response);
      }
    })
  })
}

module.exports.setPayment = function(data) {
  return new Promise((resolve, reject) => {
    database.connection.query('INSERT INTO payments SET ?', data, function(error, results, fields) {
      if(error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    })
  })
}

module.exports.setPrizedSubscriber = function(data) {
  return new Promise((resolve, reject) => {
    database.connection.query('UPDATE subscribers SET prized_cycle=? WHERE token=? AND group_id=? AND active=1', [data["cycle"], data["token"], data["group_id"]], function(error, results, fields) {
      if(error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    })
  })
}

module.exports.getGroupPayment = function(groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT SUM(amount) as total FROM payments WHERE group_id=?', [groupId], function(error, results, fields) {
      if(error) {
        return reject(error);
      } else {
        return resolve(results[0]);
      }
    })
  })
}

module.exports.getActiveSubscribers = function(groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM subscribers WHERE group_id=?',[groupId], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        return resolve(results);
      }
    })
  })
}

module.exports.getMonthsOver = function(groupId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM groupinfo WHERE grp_id=?', [groupId], function (error, results, fields) {
      if (error) {
        return reject(error)
      } else {
        var groupData = setGroupData(results)
        return resolve(groupData)
      }
    })
  })
}

module.exports.getUserPayment = function(token, groupId, activeStatus) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT SUM(amount) as total FROM payments WHERE token=? AND group_id=? AND active=?', [[token], [groupId], [activeStatus]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        return resolve(results[0]);
      }
    })
  })
}

module.exports.getSubscriberPaymentDetails = function(groupId, tokenId) {
  return new Promise((resolve, reject) => {
    database.connection.query('SELECT * FROM payments WHERE token=? AND group_id=?', [[tokenId], [groupId]], function(error, results, fields) {
      if(error) {
        return reject(error)
      } else {
        for(var i=0; i<results.length; i++) {
          paymentDate = new Date(results[i]["payment_date"]);
          paymentDate = paymentDate.getDate() + "/" + (paymentDate.getMonth() + 1) + "/" + paymentDate.getFullYear() + " " + paymentDate.getHours() + ":" + paymentDate.getMinutes()
          results[i]["payment_date"] = paymentDate
        }
        return resolve(results)
      }
    })
  })
}