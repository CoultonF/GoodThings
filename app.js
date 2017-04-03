var express = require('express'),

bodyParser = require('body-parser'),

cookieParser = require('cookie-parser'),

mongodb = require('mongodb'),

MongoClient = mongodb.MongoClient,

url = 'mongodb://localhost:27017/Good_Things',

mongoose = require('mongoose'),

bcrypt = require('bcryptjs'),

fs = require('fs'),

app = express(),

server = require('http').createServer(app),

io = require('socket.io').listen(server),

helmet = require('helmet'),

passport = require('passport'),

bitString = require('bitstring'),

session = require('express-session'),

flash = require('connect-flash'),

morgan = require('morgan'),

profile = require('./src/app/profile'),

bits = new bitString(),

port = 3000,

homeRouter = express.Router();

signinRouter = express.Router();

signupRouter = express.Router();

loginRouter = express.Router();

chatRouter = express.Router();

landingPageRouter = express.Router();

businessInfoRouter = express.Router();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(helmet());

// required for passport
app.use(session({ secret: 'Good_Things',
    resave: false,
    saveUninitialized: false })); // session secret
    //see ./src/passport/passport.js for the passport code


    app.use(morgan('dev')); // log every request to the console

    app.use(passport.initialize());

    app.use(passport.session()); // persistent login sessions

    mongoose.connect(url, function(error, db) {
        if(error){
            console.log(error);
        }
        else {
            console.log("Connection made at: " +url);
        }
    });

    app.use(flash());

    require('./src/passport/passport')(passport);

    homeRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.redirect('/home');
    });
    app.get('/home', isLoggedIn, function(req, res) {
        res.sendFile(__dirname + '/user-page.html');
    });
    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.post('/editProfile', isLoggedIn, function(req, res) {

        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        console.log(req.body.firstName);
        var data = {"firstName":firstName,"lastName":lastName};
        profile.updateProfile(req.user.local.email, data);
        console.log('EMAIL: '+req.user.local.email);
        res.send(req.user);

    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    /*
      TODO:Implement chat
    */
    app.get('/chat', function(req, res) {
        res.send('Chat');
    });

    app.get('/profile', function(req, res) {
        res.send('Profile');
    });

    chatRouter.route('/').get(function(req, res){

            res.sendFile(__dirname + '/home-page.html');

    });

    signinRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    signupRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    landingPageRouter.route('/').get(function(req, res){

        if (isLoggedIn())
            res.redirect('/home');
        else
            res.sendFile(__dirname + '/home-page.html');

    });

    businessInfoRouter.route('/').get( function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    app.get('/', function(req, res){

        if (req.isAuthenticated())
            res.redirect('/home');
        else
            res.sendFile(__dirname + '/home-page.html');

    });

    app.use('/login', loginRouter);

    app.use('/home', homeRouter);

    app.use('/chat', chatRouter);

    app.use('/signin', signinRouter);

    app.use('/', landingPageRouter);

    app.use('/signup', signupRouter);

    app.use('/business', businessInfoRouter);

    function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
    }

    //Socket.io server instance
    server.listen(3000, function(err){
        if(err){console.log('Error: ' + err);}
        else
        console.log('HTTP Server started at localhost: 3000');
    });
/*    app.listen(port, function(err){
        if(err){console.log('Error: ' + err);}
        else
        console.log('Server started at localhost:' + port);
    });
*/
newMessages = 0;
users = [];
connections = [];
    io.sockets.on('connection', function(socket){
      connections.push(socket);
      console.log('Connected: %s sockets connected', connections.length);

      //Disconnected
      socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
      });

      socket.on('send message', function(data){
        io.sockets.emit('new message',{msg: data, user: socket.username});
      });

      socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
      });

      function updateUsernames(){
        io.sockets.emit('get users', users);
      }

      //socket.on('send message', function(data){
      //  io.sockets.emit('new message',data);
      //});
    });
