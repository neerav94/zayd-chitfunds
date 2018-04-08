const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const group = require('../models/group')
const config = require('../config/database')

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
      if(response.status == 1) {
        res.json({
          status: false, // error occured since group already exists
          message: 'Group already exists.'
        })
      } else if(response.status == 0) {
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
  group.getAllGroups((error, results, fields) => {
    if(error) {
      res.json({
        status: false,
        message: 'Some error occurred. Please try again.'
      })
    } else {
      res.json({
        status: true,
        message: results
      })
    }
  })
})

module.exports = router;