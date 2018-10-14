const express = require('express');

const path = require('path');

// const favicon = require('serve-favicon');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expresshbs = require('express-handlebars');
const mongoose = require('mongoose');
const validator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const autoIncrement = require('mongoose-auto-increment');

// Make database connection
mongoose.connect('mongodb://localhost:27017/charm');
const db = mongoose.connection;

autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('Database Connection Successful');
});

require('./config/passport');

const app = express();

// view engine setup
app.engine('.hbs', expresshbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(session({ saveUninitialized: false, resave: false, secret: process.env.SECRET_KEY }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});

// Set up CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// app.use('/create', create);
const create = require('./routes/create');
const user = require('./routes/user');
const index = require('./routes/index');


app.use('/', index);
app.use('/user', user);
app.use('/create', create);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;


const debug = require('debug')('charm:server');

const http = require('http');


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */

const appPort = normalizePort(process.env.PORT || '3000');

app.set('port', appPort);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);










////////////////////////////////////////////////////////////////////////////////////////////
