const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const user = require('../models/user')
const config = require('../config/database')

//Register
router.post('/register', (req, res, next) => {
  var today = new Date();

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  var users = {
    "name": req.body.name,
    "email": req.body.email,
    "number": req.body.number,
    "password": hashedPassword,
    "created_at": today
  }

  user.checkUserExist(req.body.number)
    .then(response => {
      if (response.status == 0) {
        res.json({
          status: 401, // error occured since user already exists
          message: 'User already exist'
        })
      } else if (response.status == 1) {
        user.addNewUser(users, (error, results, fields) => {
          if (error) {
            res.json({
              status: 500, // error occured while registering
              message: 'fail'
            })
          } else {
            res.json({
              status: 200,
              message: 'success'
            })
          }
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.json({
        status: 500, // error occured while registering
        message: 'fail'
      })
    });
})

//authenticate
router.post('/authenticate', (req, res, next) => {
  const number = req.body.number;
  const password = req.body.password;

  user.checkUserExist(number) 
  .then(response => {
    if(response.status == 1) {
      return res.json({success: false, msg: 'User does not exist'});
    } else if(response.status == 0) {
      user.getUser(number, password, response.user[0].password)
      .then(loginStatus => {
        if(loginStatus == 0) {
          return res.json({success: false, msg: 'Wrong password'});
        } else if(loginStatus == 1) {
          var temp = {}
          temp["user"] = {}
          temp["user"]["number"] = response.user[0].number
          temp["user"]["email"] = response.user[0].email
          temp["user"]["name"] = response.user[0].name
          const token = jwt.sign(temp, config.secret, {
            expiresIn: 604800 // 1 week in seconds
          });

          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              name: response.user[0].name,
              number: response.user[0].number,
              email: response.user[0].email
            }
          });
        }
      })
      .catch(error => {
        console.log(error)
        return res.json({
          success: false, // error occured while registering
          message: 'Some error occurred'
        })
      })
    }
  })
  .catch(err => {
    console.log(err)
    return res.json({
      success: false, // error occured while registering
      message: 'Some error occurred'
    })
  })
})

//profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
})

module.exports = router;