require('dotenv').config();
const local = require('./local');
var cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
var app = express();
const passport = require('passport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy


app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
);

mongoose
	.connect('mongodb://localhost/jobsAPI', { useNewUrlParser: true })
	.then((x) => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
	});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//Passport
app.use(passport.initialize());
app.use(passport.session());

const user = require('./models/User')

passport.use(new LocalStrategy(
  function(username, password, done) {
		debugger
    user.findOne({ "info.base.email": username }, function (err, user) {
			debugger
      if (err) { return done(err); }
      else if (user === null) { return done(null, false); }
			else if (user != null){
				bcrypt.compare(password, user.info.base.password, (err, res) => {
					debugger
					if(err){console.log(err); return done(null, false)}
					else if(res){
						debugger
						return done(null, res);
					}
					else{
						debugger
						return done(null, res);
					}
				})
			}
			else{
				debugger
				return done(null, user);
			}
    });
  }
));

passport.serializeUser(function(user, done) {
	debugger
  done(null, {id: user.id, email: user.email});
});
 
passport.deserializeUser(function(id, done) {
  user.findById(id, function (err, user) {
		debugger
    done(err, user);
  });
});

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true
	})
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
const register = require('./routes/register.js');
const postJob = require('./routes/postJob.js');
const searchJob = require('./routes/searchJob.js');
const checkEmail = require('./routes/checkEmai.js');
const login = require('./routes/login');
const profileInfo = require('./routes/profileInfo')
//Routes
app.use('/', index);
app.use('/register', register);
app.use('/post-job', postJob);
app.use('/search-job', searchJob);
app.use('/checkEmail', checkEmail);
app.use('/login', login);
app.use('./profileInfo', profileInfo)

var os = require('os');
var ifaces = os.networkInterfaces();
console.log(ifaces);

let ipAddress = local.ipAddress;

app.listen(local.port, ipAddress, () => {
	console.log(`Listening ${local.port}`);
});

module.exports = app;
