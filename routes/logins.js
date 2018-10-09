const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const user = require('../models/login')
const config = require('../config/database')

//Register User; role is set to 0, since user is registering
router.post('/users/register', (req, res, next) => {
  var today = new Date();

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  var users = {
    "name": req.body.name,
    "email": req.body.email,
    "number": req.body.number,
    "role": 0,
    "password": hashedPassword,
    "created_at": today
  }

  user.checkUserExist(req.body.number)
    .then(response => {
      if (response.status == 0) {
        res.json({
          status: false, // error occured since user already exists
          message: 'User with this contact number already exists.'
        })
      } else if (response.status == 1) {
        user.addNewUser(users, (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json({
              status: false, // error occured while registering
              message: 'Some error occurred. Please try again.' + error
            })
          } else {
            res.json({
              status: true,
              message: 'Successfully registered.'
            })
          }
        });
      }
    })
    .catch(err => {
      res.json({
        status: false, // error occured while registering
        message: 'Some error occurred. Please try again.'
      })
    });
})

//Register Admin; role is set to 1, since admin is registering
router.post('/admin/adminRegister', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var today = new Date();
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  var users = {
    "name": req.body.name,
    "email": req.body.email,
    "number": req.body.number,
    "role": 1,
    "password": hashedPassword,
    "created_at": today
  }

  const number = req.user[0].number; //get admin's number from header
  user.isSuperAdmin(number)
    .then(response => {
      // role = 0; normal user
      // role = 1; admin
      // role = 2; super user
      if (response[0].role == 0) {
        return res.json({
          status: false, // error occured while registering
          message: 'Permission Denied'
        })
      } else if (response[0].role == 1) {
        return res.json({
          status: false, // error occured while registering
          message: 'Permission Denied'
        })
      } else if (response[0].role == 2) {
        user.checkUserExist(req.body.number)
          .then(response => {
            if (response.status == 0) {
              res.json({
                status: false, // error occured since admin already exists
                message: 'Admin with this contact number already exists.'
              })
            } else if (response.status == 1) {
              user.addNewUser(users, (error, results, fields) => {
                if (error) {
                  res.json({
                    status: false, // error occured while registering
                    message: 'Some error occurred. Please try again.'
                  })
                } else {
                  res.json({
                    status: true,
                    message: 'Successfully Registered.'
                  })
                }
              });
            }
          })
          .catch(err => {
            console.log(err)
            res.json({
              status: false, // error occured while registering
              message: 'Some error occurred. Please try again.'
            })
          });
      }
    })
    .catch(err => {
      console.log(err)
      return res.json({
        status: false, // error occured while registering
        message: 'Some error occurred. Please try again.'
      })
    })
})

router.get('/admin/getAdmins', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  user.getAdmin().then(response => {
      return res.json({
        status: true,
        message: response
      })
    })
    .catch(err => {
      console.log(err);
      return res.json({
        status: false, // error occured while registering
        message: 'Some error occurred. Please try again.' + err
      })
    })
})

router.get('/admin/deleteAdmin', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  user.deleteAdmin(req.query.id).then(response => {
      return res.json({
        status: true,
        message: response
      })
    })
    .catch(err => {
      console.log(err);
      return res.json({
        status: false,
        message: "Some error occurred. Please try again." + err
      })
    })
})

router.post('/admin/forgotPassword', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var salt = bcrypt.genSaltSync(10);
  var hashedNewPassword = bcrypt.hashSync(req.body.password, salt);
  user.forgotPassword(hashedNewPassword, req.body.number)
  .then(response => {
    return res.json({
      status: true,
      message: "Success"
    })
  })
  .catch(err => {
    console.log(err);
    return res.json({
      status: false,
      message: "Some error occurred.Please try again. " + err
    })
  })
})

router.post('/admin/deleteNumber', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var number = req.body.mobileNumber
  user.checkUserExist(number)
  .then(response => {
    if(response.status === 0) {
      user.deleteNumber(number)
      .then(response => {
        return res.json({
          status: true,
          message: "Success"
        })
      })
      .catch(err => {
        return res.json({
          status: false,
          message: 'Some error occurred. PLease try again ' + err
        })
      })
    } else {
      return res.json({
        status: false,
        message: "User with this number does not exist"
      })
    }
  })
  .catch(err => {
    console.log(err);
    return res.json({
      status: false,
      message: "Some error occurred. Please try again. " + err
    })
  })
})

router.post('/admin/updateNumber', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var oldNumber = req.body.oldNumber;
  var newNumber = req.body.newNumber;
  user.checkUserExist(oldNumber)
  .then(response => {
    if(response.status === 0) {
      user.updateNumber(oldNumber, newNumber)
      .then(response => {
        return res.json({
          status: true,
          message: "Success"
        })
        .catch(err => {
          return res.json({
            status: false,
            message: 'Some error occurred. PLease try again ' + err
          })
        })
      })
    } else {
      return res.json({
        status: false,
        message: "User with the old number does not exist"
      })
    }
  })
  .catch(err => {
    console.log(err);
    return res.json({
      status: false,
      message: "Some error occurred. Please try again. " + err
    })
  })
})

router.post('/admin/updatePassword', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var salt = bcrypt.genSaltSync(10);
  user.getPassword(req.body.number)
    .then(response => {
      if (response.status) {
        var comparePassword = bcrypt.compareSync(req.body.oldPassword, response.data)
        if (comparePassword) {
          var hashedNewPassword = bcrypt.hashSync(req.body.newPassword, salt);
          user.updatePassword(hashedNewPassword, req.body.number)
            .then(response => {
              if (response.status) {
                return res.json({
                  status: true,
                  message: "Success"
                })
              }
            })
            .catch(err => {
              console.log(err);
              return res.json({
                status: false,
                message: "Some error occurred.Please try again. " + err
              })
            })
        } else {
          return res.json({
            status: false,
            message: "Please enter correct old password."
          })
        }
      }
    })
    .catch(err => {
      console.log(err);
      return res.json({
        status: false,
        message: "Some error occurred.Please try again. " + err
      })
    })
})

//Register Admin; role is set to 2, since admin is registering
router.post('/admin/superAdminRegister', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  var today = new Date();
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);

  var users = {
    "name": req.body.name,
    "email": req.body.email,
    "number": req.body.number,
    "role": 2,
    "password": hashedPassword,
    "created_at": today
  }

  const number = req.user[0].number; //get admin's number from header
  user.isSuperAdmin(number)
    .then(response => {
      // role = 0; normal user
      // role = 1; admin
      // role = 2; super user
      if (response[0].role == 0) {
        return res.json({
          status: false, // error occured while registering
          message: 'Permission Denied'
        })
      } else if (response[0].role == 1) {
        return res.json({
          success: false, // error occured while registering
          message: 'Permission Denied'
        })
      } else if (response[0].role == 2) {
        user.checkUserExist(req.body.number)
          .then(response => {
            if (response.status == 0) {
              res.json({
                status: false, // error occured since admin already exists
                message: 'Admin with this contact number already exists.'
              })
            } else if (response.status == 1) {
              user.addNewUser(users, (error, results, fields) => {
                if (error) {
                  res.json({
                    status: false, // error occured while registering
                    message: 'Some error occurred. Please try again.'
                  })
                } else {
                  res.json({
                    status: true,
                    message: 'Successfully Registered.'
                  })
                }
              });
            }
          })
          .catch(err => {
            console.log(err)
            res.json({
              status: false, // error occured while registering
              message: 'Some error occurred. Please try again.'
            })
          });
      }
    })
    .catch(err => {
      console.log(err)
      return res.json({
        status: false, // error occured while registering
        message: 'Some error occurred. Please try again.'
      })
    })
})

//authenticate
router.post('/users/authenticate', (req, res, next) => {
  const number = req.body.number;
  const password = req.body.password;

  user.checkUserExist(number)
    .then(response => {
      if (response.status == 1) {
        return res.json({
          status: false,
          message: 'User does not exist for this contact number.'
        });
      } else if (response.status == 0) {
        user.getUser(number, password, response.user[0].password)
          .then(loginStatus => {
            if (loginStatus == 0) {
              return res.json({
                status: false,
                message: 'Please enter correct password.'
              });
            } else if (loginStatus == 1) {
              var temp = {}
              temp["user"] = {}
              temp["user"]["number"] = response.user[0].number
              temp["user"]["email"] = response.user[0].email
              temp["user"]["name"] = response.user[0].name
              temp["user"]["role"] = response.user[0].role

              const token = jwt.sign(temp, config.secret, {
                expiresIn: 604800 // 1 week in seconds
              });

              res.json({
                status: true,
                token: 'Bearer ' + token,
                user: {
                  name: response.user[0].name,
                  number: response.user[0].number,
                  email: response.user[0].email,
                  role: response.user[0].role
                },
                message: "Successfully Registered."
              });
            }
          })
          .catch(error => {
            console.log(error)
            return res.json({
              status: false, // error occured while registering
              message: 'Some error occurred. Please try again.'
            })
          })
      }
    })
    .catch(err => {
      console.log(err)
      return res.json({
        status: false, // error occured while registering
        message: 'Some error occurred. Please try again.'
      })
    })
})

//profile
router.get('/users/home', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  if (req.user[0].role == 0) {
    res.json({
      status: true,
      user: req.user
    });
  } else {
    res.json({
      status: false,
      user: null
    })
  }
})

module.exports = router;
