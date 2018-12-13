require('dotenv').config();
const local = require('./local');
var cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
var app = express();

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
const checkEmail = require('./routes/checkEmai.js');

app.use('/', index);
app.use('/register', register);
app.use('/post-job', postJob);
app.use('/checkEmail', checkEmail);

var os = require('os');
var ifaces = os.networkInterfaces();
console.log(ifaces);

// let ipAddress = '10.85.2.141';

// app.listen(5001, ipAddress, () => {
// 	console.log('Listening 5001');
// });

let ipAddress = local.ipAddress;

app.listen(local.port, ipAddress, () => {
	console.log(`Listening ${local.port}`);
});

module.exports = app;
