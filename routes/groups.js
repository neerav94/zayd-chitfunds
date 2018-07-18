const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const group = require('../models/group')
const login = require('../models/login')
const config = require('../config/database')

//require multer for the file uploads
var multer = require('multer');
// require xlsx for file reading of type .xlsx
var XLSX = require('xlsx')

// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR)
  },
  filename: function (req, file, cb) {
    cb(null, "subscriberInfo.xlsx")
  }
})
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({
  storage: storage
}).single('subscriberData');

checkGroupExist = function (item) {
  return new Promise((resolve, reject) => {
    group.getGroupId(item["group"], (error, results, fields) => {
      if (results.length > 0) {
        item["groupId"] = results[0]["grp_id"]
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

checkUserSubscribed = function (item) {
  return new Promise((resolve, reject) => {
    login.checkUserExist(item["mobile"])
      .then(response => {
        if (response.status == 1) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
  })
}

subscribeMultipleUsers = function (item) {
  return new Promise((resolve, reject) => {
    var data = {}
    data["name"] = item["name"]
    data["number"] = item["mobile"]
    data["token"] = item["token"]
    data["group_id"] = item["groupId"]
    data["group_name"] = item["group"]
    group.subscribeUser(data, (error, results, fields) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

getUsersPayment = function (item, months, amountToPay) {
  return new Promise((resolve, reject) => {
    group.getUserPayment(item.token, item.group_id, item.active)
      .then(res => {
        var totalAmountToPay = 0;
        if(item.months && item.active==0) {
          totalAmountToPay = amountToPay * parseInt(item.months);
        } else if(item.months && item.active ==1) {
          var diffMonths = months - parseInt(item.months);
          if(diffMonths <= 0) {
            totalAmountToPay = 0;
          } else {
            totalAmountToPay = amountToPay * diffMonths;
          }
        } else {
          totalAmountToPay = amountToPay * months;
        }
        if (res.total) {
          if (res.total < totalAmountToPay) {
            item["pending"] = totalAmountToPay - res.total;
            item["advance"] = 0;
          } else if (res.total > totalAmountToPay) {
            item["pending"] = 0;
            item["advance"] = res.total - totalAmountToPay;
          } else {
            item["pending"] = 0;
            item["advance"] = 0;
          }
          item["amount"] = res.total;
        } else {
          item["pending"] = totalAmountToPay;
          item["amount"] = 0;
          item["advance"] = 0;
        }
        return resolve(item);
      })
      .catch(err => {
        return reject(err);
      })
  })
}

router.post('/createGroup', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var groups = {
    "grp_name": req.body.name,
    "num_members": req.body.months,
    "chit_value": req.body.chitValue,
    "status": req.body.status,
    "auction_day": req.body.auctionDate
  }
  group.checkGroupExist(req.body.name)
    .then(response => {
      if (response.status == 1) {
        res.json({
          status: false, // error occured since group already exists
          message: 'Group already exists.'
        })
      } else if (response.status == 0) {
        group.createNewGroup(groups, (error, results, fields) => {
          if (error) {
            res.json({
              status: false, // error occured while creating
              message: 'Some error occurred. Please try again.'
            })
          } else {
            res.json({
              status: true,
              message: 'Successfully created.'
            })
          }
        })
      }
    })
    .catch(err => {
      res.json({
        status: false, // error occured while creating group
        message: 'Some error occurred. Please try again.'
      })
    });
})

router.get('/getAllGroups', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.getAllGroups()
    .then(response => {
      res.json({
        status: true,
        message: response
      })
    })
    .catch(error => {
      res.json({
        status: false,
        message: "Some error occurred while fetching all the groups."
      })
    })
})

router.get('/getGroupByNumber', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.getGroupByNumber(req.query.number)
    .then(response => {
      res.json({
        status: true,
        message: response
      })
    })
    .catch(error => {
      res.json({
        status: false,
        message: "Some error occurred. Please try again." + error
      })
    })
})

router.get('/getGroupById', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.getGroupById(req.query.id)
    .then(response => {
      res.json({
        status: true,
        message: response
      })
    })
    .catch(error => {
      res.json({
        status: false,
        message: "Some error occurred. Please try again." + error
      })
    })
})

router.get('/getAllSubscribers', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  group.getAllSubscribers(req.query.groupId)
    .then(response => {
      res.json({
        "status": true,
        "message": response
      })
    })
    .catch(error => {
      res.json({
        "status": false,
        "message": "Some error occurred. Please try again."
      })
    })
})

router.post('/setDate', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.setDateForGroup(req.body, (error, results, fields) => {
    if (error) {
      console.log(error)
      res.json({
        status: false,
        message: "Some error occurred. Please try again."
      })
    } else {
      res.json({
        status: true,
        message: "Successfully stored start and end date."
      })
    }
  })
})

router.post('/subscribeUser', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  login.checkUserExist(req.body.contact)
    .then(response => {
      if (response.status == 1) {
        res.json({
          "status": false,
          "message": "User with this contact number does not exist in the database. Before subscribing for the group, please add the user in the database."
        })
      } else {
        group.checkTokenExist(req.body.token, req.body.groupId)
          .then(response => {
            var subscriber = {}
            subscriber["name"] = req.body.name
            subscriber["number"] = req.body.contact
            subscriber["token"] = req.body.token
            subscriber["group_id"] = req.body.groupId
            subscriber["group_name"] = req.body.groupName
            group.subscribeUser(subscriber, (error, results, fields) => {
              if (error) {
                res.json({
                  "status": false,
                  "message": "Some error occurred. Please try again."
                })
              } else {
                res.json({
                  "status": true,
                  "message": "User was successfully subscribed to the group"
                })
              }
            })
          })
          .catch(response => {
            res.json({
              "status": 0,
              "message": "Some error occurred. Please try again"
            })
          })
      }
    })
    .catch(response => {
      res.json({
        "status": false,
        "message": "Some error occurred. Please try again."
      })
    })
})

router.post('/removeUser', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.checkTokenExist(req.body.token, req.body.groupId)
    .then(response => {
      if (response.status == 0) {
        res.json({
          "status": false,
          "message": "User with this token does not exist"
        })
      } else {
        group.removeUser(req.body.token, req.body.groupId)
          .then(response => {
            res.json({
              "status": true,
              "message": "User was successfully removed from the group"
            })
          })
          .catch(response => {
            res.json({
              "status": 0,
              "message": "Some error occurred. Please try again" + response
            })
          })
      }
    })
})

router.post('/subscribeUsers', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  return new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err) {
          res.json({
            "status": false,
            "message": "Some error occurred. Please try again."
          })
          return reject({
            "status": false
          })
        } else {
          return resolve({
            "status": true
          })
        }
      })
    })
    .then(response => {
      var workbook = XLSX.readFile('./uploads/subscriberInfo.xlsx');
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      var flag = true;

      for (var i in xlData) {
        if (!xlData[i]["mobile"]) {
          flag = false;
        } else if (!xlData[i]["name"]) {
          flag = false;
        } else if (!xlData[i]["token"]) {
          flag = false;
        } else if (!xlData[i]["group"]) {
          flag = false;
        }
      }

      if (flag) {
        return new Promise((resolve, reject) => {
          var promises = []
          for (var i = 0; i < xlData.length; i++) {
            promises.push(checkUserSubscribed(xlData[i]))
          }
          var contactString = ""
          Promise.all(promises).then(response => {
            for (var i in response) {
              if (!response[i]) {
                contactString += xlData[i]["mobile"] + ", "
              }
            }
            if (contactString.length == 0) {
              resolve(response)
            } else {
              res.json({
                "status": false,
                "message": "The contacts " + contactString + " are not registered as a user. Please register them first."
              })
            }
          })
        }).then(response => {
          return new Promise((resolve, reject) => {
              var promises = []
              for (var i = 0; i < xlData.length; i++) {
                promises.push(checkGroupExist(xlData[i]))
              }
              var groupNameStatus = false;
              Promise.all(promises).then(response => {
                for (var i in response) {
                  if (!response[i]) {
                    groupNameStatus = true;
                    break
                  }
                }
                if (groupNameStatus) {
                  res.json({
                    "status": false,
                    "message": "Group name does not exist. Please check the group name and try again."
                  })
                } else {
                  resolve(xlData)
                }
              })
            })
            .then(response => {
              return new Promise((resolve, reject) => {
                  var promises = []
                  for (var i = 0; i < xlData.length; i++) {
                    promises.push(subscribeMultipleUsers(xlData[i]))
                  }
                  var userSubscribedStatus = false;
                  Promise.all(promises).then(response => {
                    for (var i in response) {
                      if (!response[i]) {
                        userSubscribedStatus = true
                        break;
                      }
                    }
                    if (userSubscribedStatus) {
                      res.json({
                        "status": false,
                        "message": "Some error occurred. Please try again"
                      })
                    } else {
                      resolve(true)
                    }
                  })
                })
                .then(response => {
                  res.json({
                    "status": true,
                    "message": "Users are successfully subscribed to the group."
                  })
                })
            })
        })
      } else {
        res.json({
          "status": false,
          "message": "Some entry is empty."
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.json({
        "status": false,
        "message": "Some error occurred. PlLease try again."
      })
    })
})

router.post('/substituteSubscriber', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  login.checkUserExist(req.body.number)
    .then(response => {
      if (response.status == 1) {
        res.json({
          "status": false,
          "message": "User with this contact number does not exist in the database. Before substituting, please add the user in the database."
        })
      } else {
        var subscriber = {}
        subscriber["name"] = req.body.name
        subscriber["number"] = req.body.number
        subscriber["token"] = req.body.token
        subscriber["group_id"] = req.body.groupId
        subscriber["group_name"] = req.body.groupName
        subscriber["months"] = req.body.monthsRemaining
        group.editActiveStatus(req.body.groupId, req.body.token, req.body.monthsOver)
        .then(response => {
          group.subscribeUser(subscriber, (error, results, fields) => {
            if(error) {
              res.json({
                "status": false,
                "message": "Some error occurred. Please try again " + error
              })
            } else {
              res.json({
                "status": true,
                "message": "User was successfully substituted."
              })
            }
          })
        })
        .catch(err => {
          res.json({
            "status": false,
            "message": "Some error occurred. Please try again. " + err
          })
        })
      }
    })
})

router.post('/recordPayment', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  var promises = []
  for (var i = 0; i < req.body.length; i++) {
    promises.push(group.setPayment(req.body[i]))
  }
  Promise.all(promises).then(response => {
      res.json({
        "status": true,
        "message": "Success"
      })
    })
    .catch(err => {
      console.log(err);
      res.json({
        "status": false,
        "message": "Some error occurred."
      })
    })
})

router.post('/recordPrizedSubscriber', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  group.setPrizedSubscriber(req.body).then(data => {
      res.json({
        "status": true,
        "message": "Success"
      })
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Some error occurred."
      })
    })
})

router.get('/getGroupPayment', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  group.getGroupPayment(req.query.groupId)
    .then(response => {
      res.json({
        "status": true,
        "message": response.total
      })
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Error: " + err
      })
    })
})

router.get('/getDailyCollection', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var dateObj = new Date();
  var month = parseInt(dateObj.getMonth())
  month = month + 1
  var startDate = dateObj.getFullYear() + '.' + month + '.' + dateObj.getDate() + ' ' + '00:00:00'
  var endDate = dateObj.getFullYear() + '.' + month + '.' + dateObj.getDate() + ' ' + '23:59:59'
  startDate = new Date(startDate).getTime()
  endDate = new Date(endDate).getTime()
  group.getDailyCollection(startDate, endDate)
    .then(response => {
      if (response.status) {
        res.json({
          "status": true,
          "message": response.message
        })
      } else {
        res.json({
          "status": false,
          "message": "Error: " + response.message
        })
      }
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Some error occurred. Please try again " + err
      })
    })
})

function getStartAndEndOfWeek(date) {

  //Calculating the starting point

  var curr = date ? new Date(date) : new Date();
  var first = curr.getDate() - dayOfWeek(curr);

  var firstday, lastday;

  if (first < 1) {
    //Get prev month and year
    var k = new Date(curr.valueOf());
    k.setDate(1);
    k.setMonth(k.getMonth() - 1);
    var prevMonthDays = new Date(k.getFullYear(), (k.getMonth() + 1), 0).getDate();

    first = prevMonthDays - (dayOfWeek(curr) - curr.getDate());
    firstday = new Date(k.setDate(first));
    lastday = new Date(k.setDate(first + 6));
  } else {
    // First day is the day of the month - the day of the week
    firstday = new Date(curr.setDate(first));
    lastday = new Date(curr.setDate(first + 6));
  }

  return [firstday, lastday];
}

function dayOfWeek(date, firstDay) {
  var daysOfWeek = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  firstDay = firstDay || "monday";
  var day = date.getDay() - daysOfWeek[firstDay];
  return (day < 0 ? day + 7 : day);
}

router.get('/getWeeklyCollection', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var dateObj = new Date();
  var month = parseInt(dateObj.getMonth())
  month = month + 1
  var startDate = dateObj.getFullYear() + '.' + month + '.' + dateObj.getDate()
  var dateArray = getStartAndEndOfWeek(startDate);
  startDate = dateArray[0].getTime();
  var endDate = dateArray[1].getTime();
  group.getWeeklyCollection(startDate, endDate)
    .then(response => {
      if (response.status) {
        res.json({
          "status": true,
          "message": response.message
        })
      } else {
        res.json({
          "status": false,
          "message": "Error: " + response.message
        })
      }
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Some error occurred. Please try again " + err
      })
    })
})

router.get('/getActiveSubscribers', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  group.getMonthsOver(req.query.groupId)
    .then(response => {
      var months = response[0].months;
      var amountToPay = response[0].chit_value / response[0].num_members;
      group.getActiveSubscribers(req.query.groupId)
        .then(response => {
          var promises = []
          for (var i = 0; i < response.length; i++) {
            promises.push(getUsersPayment(response[i], months, amountToPay));
          }
          Promise.all(promises).then(data => {
            res.json({
              "status": true,
              "message": data
            })
          })
        })
        .catch(err => {
          res.json({
            "status": false,
            "message": "Error: " + err
          })
        })
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Error: " + err
      })
    })
})

router.get('/getSubscribedGroups', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.getSubscribedGroups(req.query.number)
  .then(response => {
    return res.json({
      "status": true,
      "message": response
    })
  })
  .catch(err => {
    res.json({
      "status": false,
      "message": "Some error occurred: " + err
    })
  })
})

router.get('/getUserSavings', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  group.getUserPayment(req.query.token, req.query.groupId, req.query.active).then(response => {
    return res.json({
      "status": true,
      "message": response.total
    }) 
  })
  .catch(err => {
    res.json({
      "status": false,
      "message": "Some error occurred: " + err
    })
  })
})

router.get('/getSubscriberPaymentDetails', passport.authenticate('jwt', {
  "session": false
}), (req, res, next) => {
  var groupId = req.query.groupId;
  var tokenId = req.query.tokenId;
  group.getSubscriberPaymentDetails(groupId, tokenId)
    .then(response => {
      res.json({
        "status": true,
        "message": response
      })
    })
    .catch(err => {
      res.json({
        "status": false,
        "message": "Error: " + err
      })
    })
})

module.exports = router;