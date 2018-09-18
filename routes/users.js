const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const user = require('../models/user')
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
    cb(null, "userInfo.xlsx")
  }
})
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({
  storage: storage
}).single('photo');

addSubscribedGroups = function(item) {
  return new Promise((resolve, reject) => {
    user.getSubscribedGroups(item.number)
    .then(response => {
      item["subscribedGroups"] = response["name"];
      resolve(response);
    })
  })
}

addMultipleUsers = function(item, index) {
  login.checkUserExist(item["mobile"])
  .then(response => {
    if (response.status == 1) {
      var today = new Date();
      var email = ""
      if(!item.hasOwnProperty('email')) {
        email = ""
      } else {
        email = item["email"]
      }
      var salt = bcrypt.genSaltSync(10);
      var temp = item["mobile"].toString()
      var hashedPassword = bcrypt.hashSync(temp, salt);
      var user = {
        "name": item["name"],
        "email": email,
        "number": item["mobile"],
        "role": 0,
        "password": hashedPassword,
        "created_at": today
      }
      login.addNewUser(user, (error, results, fields) => {
        if (error) {
          res.json({
            status: false,
            message: "Some error occurred. Please try again."
          })
        } else {
          flag = true;
        }
      })
    }
  }) 
  return true;
}

router.post('/addUser', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var today = new Date();
  var salt = bcrypt.genSaltSync(10);
  var temp = req.body.contact.toString()
  var hashedPassword = bcrypt.hashSync(temp, salt);

  var user = {
    "name": req.body.name,
    "email": req.body.email,
    "number": req.body.contact,
    "role": 0,
    "password": hashedPassword,
    "created_at": today
  }

  login.checkUserExist(req.body.contact)
    .then(response => {
      if (response.status == 0) {
        res.json({
          status: false,
          message: 'User with this contact number already exist.'
        })
      } else if (response.status == 1) {
        login.addNewUser(user, (error, results, fields) => {
          if (error) {
            res.json({
              status: false,
              message: "Some error occurred. Please try again."
            })
          } else {
            res.json({
              status: true,
              message: 'Successfully added a new user.'
            })
          }
        })
      }
    })
    .catch(err => {
      res.json({
        status: false,
        message: 'Some error occurred. Please try again.'
      })
    })
})

router.get('/getAllUsers', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  user.getAllUsers((error, results, fields) => {
    if (error) {
      res.json({
        status: false,
        message: 'Some error occurred. Please try again.'
      })
    } else {
      return new Promise((resolve, reject) => {
        var promises = []
        for(var i=0; i<results.length; i++) {
          promises.push(addSubscribedGroups(results[i]))
        }
        Promise.all(promises).then(response => {
          resolve(results)
        })
      }).then(response => {
        res.json({
          status: true,
          message: response
        })
      })
    }
  })
})

router.get('/getUserById', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  user.getUserById(req.query.id, (error, results, fields) => {
    if (error) {
      res.json({
        "status": false,
        "message": "Some error occurred. Please try again."
      })
    } else {
      res.json({
        "status": true,
        "message": results
      })
    }
  })
})

router.post('/updateUserInfo', passport.authenticate('jwt', {
  session: false
}), function(req, res, next) {
  var jsonObj = {}
  jsonObj["name"] = req.body.name
  jsonObj["father_husband_name"] = req.body.fatherName
  jsonObj["dob"] = req.body.dob
  jsonObj["age"] = req.body.age
  jsonObj["gender"] = req.body.gender
  jsonObj["other_number"] = req.body.otherNumber
  jsonObj["residential_address"] = req.body.resAddress
  jsonObj["pan"] = req.body.pan
  jsonObj["aadhar"] = req.body.aadhar
  jsonObj["nominee"] = req.body.nominee
  jsonObj["dependents"] = req.body.dependents
  jsonObj["occupation"] = req.body.occupation
  jsonObj["business_name"] = req.body.business
  jsonObj["office_address"] = req.body.officeAddress
  jsonObj["income"] = req.body.income
  jsonObj["first_reference"] = req.body.firstReference
  jsonObj["second_reference"] = req.body.secondReference
  jsonObj["email"] = req.body.email
  jsonObj["number"] = req.body.number
  jsonObj["id"] = req.body.id
  user.updateUserInfo(jsonObj, req.body.id)
  .then(response => {
    return res.json({
      status: true,
      message: "Success"
    })
  })
  .catch(err => {
    return res.json({
      status: false,
      message: "Some error occurred. Please try again." + err
    })
  })
})

router.post('/addMultipleUsers', passport.authenticate('jwt', {
  session: false
}), function (req, res, next) {
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) {
        res.json({
          "status": false,
          "message": "Some error occurred. Please try again." + err
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
    var workbook = XLSX.readFile('./uploads/userInfo.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var flag = true;

    for(var i in xlData) {
      if(!xlData[i]["mobile"]) {
        flag = false;
      } else if(!xlData[i]["name"]) {
        flag = false;
      }
    }
    if(flag) {
      if(!xlData.map(addMultipleUsers)) {
        res.json({
          "status": false,
          "message": "Some error occurred. Please try again."
        })
      } else {
        res.json({
          "status": true,
          "message": "All users successfully entered."
        })
      }
    } else {
      res.json({
        "status": false,
        "message": "Some entry for contact number or name is empty."
      })
    }
  })
});
module.exports = router;