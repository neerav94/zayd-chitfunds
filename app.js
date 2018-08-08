var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cors = require('cors')
var passport = require('passport')
var mysql = require('mysql')

var userPassport = require('./config/passport')

var app = express()

// var connection = require('./config/database');

const logins = require('./routes/logins')
const groups = require('./routes/groups')
const users = require('./routes/users')

const port = 3000;

// CORS middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

userPassport.user(passport);

app.use('/v1/login', logins);
app.use('/v1/group', groups);
app.use('/v1/user', users);

app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.get('/', (req, res) => {
    res.send('Invalid Endpoint')
})

// start server
app.listen(process.env.PORT || port, () => {
    console.log('Server started on port: ' + port);
});