// Kobi Kuzi 316063908
// Dan Kvitca 205570674

const createError = require('http-errors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const session = require('express-session');


// Define the Winston logging configuration
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');


const app = express();

// connect to mongoose server
mongoose.connect(process.env.MONGODB_URI);
// 
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    httpOnly: process.env.COOKIE_HTTP_ONLY,
    // maxAge: process.env.COOKIE_MAX_AGE
  }
}));
app.use(function (req, res, next) {
  winstonLogger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // Log the error message using Winston
  winstonLogger.error(err.message);
  if (process.env.NODE_ENV !== 'production'){
    winstonLogger.add(new winston.transports.Console({
      format: winston.format.simple()
    }))
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
