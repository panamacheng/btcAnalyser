var http = require('http');
var express = require('express');
var expressJwt = require('express-jwt');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cors = require('cors');
var bodyParser = require('body-parser');


var config = require('./_core/config');

var httpPort = process.env.PORT || config.server.httpPort;

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/_auth');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore( config.mysql )
}));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.session.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

app.use('/register', require('./app/controllers/authentication/register.controller'));
app.use('/login', require('./app/controllers/authentication/login.controller'));
app.use('/chart', require('./app/controllers/chart.controller'));
app.use('/api/users', require('./app/controllers/authentication/user.controller'));
app.use('/app', require('./app/controllers/app.controller'));

app.use('/', function(req, res) {
    return res.redirect('/app');
});

var httpServer = http.createServer(app);
httpServer.listen(httpPort, function() {
    console.log((new Date()) + '=> Http Sever running on http://' + httpServer.address().address + ':' + httpPort);
});
