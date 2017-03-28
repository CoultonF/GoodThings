var express = require('express'),

bodyParser = require('body-parser'),

cookieParser = require('cookie-parser'),

mongodb = require('mongodb'),

MongoClient = mongodb.MongoClient,

url = 'mongodb://localhost:27017/Good_Things',

mongoose = require('mongoose'),

bcrypt = require('bcryptjs'),

fs = require('fs'),

http = require('http'),

app = express(),

helmet = require('helmet'),

passport = require('passport'),

bitString = require('bitstring'),

session = require('express-session'),

flash = require('connect-flash'),

morgan = require('morgan'),

bits = new bitString(),

port = 3000,

homeRouter = express.Router();

signinRouter = express.Router();

signupRouter = express.Router();

loginRouter = express.Router();

landingPageRouter = express.Router();

businessInfoRouter = express.Router();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(helmet());

// required for passport
app.use(session({ secret: bits.writebits(20),
    resave: false,
    saveUninitialized: false })); // session secret
    //see ./src/passport/passport.js for the passport code
    //require('./src/passport/passport')(passport);

    app.use(morgan('dev')); // log every request to the console

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    mongoose.connect(url, function(error) {
        if(error){
            console.log(error);
        }
        else {
            console.log("Connection made at: " +url);
        }
    });

    app.use(flash());


    // define the schema for our user model
    // var userSchema = mongoose.Schema({
    //
    //     local            : {
    //         email        : String,
    //         password     : String,
    //     }
    //   });

    // methods ======================
    // generating a hash
    // userSchema.methods.generateHash = function(password) {
    //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    // };
    //
    // // checking if password is valid
    // userSchema.methods.validPassword = function(password) {
    //     return bcrypt.compareSync(password, this.local.password);
    // };

    // create the model for users and expose it to our app
    //module.exports = mongoose.model('User', userSchema);

    homeRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', function(req, res) {
        res.send('Profile');
    });


    signinRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    signupRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    landingPageRouter.route('/').get(function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    businessInfoRouter.route('/').get( function(req, res){

        res.sendFile(__dirname + '/home-page.html');

    });

    app.get('/', function(req, res){

        //TODO: authenticate token if not valid or null

        if(false)

        res.sendFile(__dirname + '/home-page.html');

        else
        //TODO: create sign in page
        res.sendFile(__dirname + '/home-page.html');

    });

    app.use('/login', loginRouter);

    app.use('/home', homeRouter);

    app.use('/signin', signinRouter);

    app.use('/', landingPageRouter);

    app.use('/signup', signupRouter);

    app.use('/business', businessInfoRouter);

    app.listen(port, function(err){

        if(err){

            console.log('Error: ' + err);

        }

        else

        console.log('Server started at localhost:' + port);

    });
