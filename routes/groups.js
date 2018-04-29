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

checkGroupExist = function(item) {
  return new Promise((resolve, reject) => {
    group.getGroupId(item["group"], (error, results, fields) => {
      if(results.length > 0) {
        item["groupId"] = results[0]["grp_id"]
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

checkUserSubscribed = function(item) {
  return new Promise((resolve, reject) => {
    login.checkUserExist(item["mobile"])
    .then(response => {
      if(response.status == 1) {
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
      if(error) {
        resolve(false);
      } else {
        resolve(true);
      }
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
    "status": req.body.status
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
        message: "Some error occurred. Please try again."
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
    console.log(results)
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
        group.checkTokenExist(req.body.token)
          .then(response => {
            if (response.status == 1) {
              res.json({
                "status": false,
                "message": "The token number is already given to a subscriber."
              })
            } else {
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
            }
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

    for(var i in xlData) {
      if(!xlData[i]["mobile"]) {
        flag = false;
      } else if(!xlData[i]["name"]) {
        flag = false;
      } else if(!xlData[i]["token"]) {
        flag = false;
      } else if(!xlData[i]["group"]) {
        flag = false;
      } 
    }
    
    if(flag) {
      return new Promise((resolve, reject) => {
        var promises = []
        for(var i=0; i<xlData.length; i++) {
          promises.push(checkUserSubscribed(xlData[i]))
        }
        var contactString = ""
        Promise.all(promises).then(response => {
          for(var i in response) {
            if(!response[i]) {
              contactString += xlData[i]["mobile"] + ", "
            }
          }
          if(contactString.length == 0) {
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
          for(var i=0; i<xlData.length; i++) {
            promises.push(checkGroupExist(xlData[i]))
          }
          var groupNameStatus = false;
          Promise.all(promises).then(response => {
            for(var i in response) {
              if(!response[i]) {
                groupNameStatus = true;
                break
              } 
            }
            if(groupNameStatus) {
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
            for(var i=0; i<xlData.length; i++) {
              promises.push(subscribeMultipleUsers(xlData[i]))
            }
            var userSubscribedStatus = false;
            Promise.all(promises).then(response => {
              for(var i in response) {
                if(!response[i]) {
                  userSubscribedStatus = true
                  break;
                }
              }
              if(userSubscribedStatus) {
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

module.exports = router;