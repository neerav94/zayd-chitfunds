const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var database = require('../config/database');
const User = require('../models/user');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = database.secret;
  
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.checkUserExist(jwt_payload.user.number)
    .then( response => {
      if(response.status == 0) {
        return done(null, response.user);
      } else if (status == 1) {
        return done(null, false);
      }
    })
    .catch( error => {
      return done(error, false);
    });
  }));
}