var express = require('express'),

bodyParser = require('body-parser'),

mongodb = require('mongodb'),

MongoClient = mongodb.MongoClient,

url = 'mongodb://localhost:27017/good_things',

fs = require('fs'),

http = require('http'),

app = express(),

helmet = require('helmet'),

passport = require('passport'),

port = 3000,

homeRouter = express.Router();

signinRouter = express.Router();

signupRouter = express.Router();

loginRouter = express.Router();

landingPageRouter = express.Router();

businessInfoRouter = express.Router();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(helmet());


//MongoClient
MongoClient.connect(url, function(err, db){

    if(err){
        console.log(err);
    }
    else{
        console.log('connection made at ' + url);
        db.close();
    }

});



homeRouter.route('/').get(function(req, res){

    res.sendFile(__dirname + '/index.html');

});

loginRouter.route('/').post(function(req, res){

    console.log(req.body.email);
    console.log(req.body.password);

    //authenticate the user using passport here...
    if (true){

        res.sendFile(__dirname + '/secure/user-page.html');

    }
    else{

        res.send('index.html');

    }

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

        res.sendFile(__dirname + '/index.html');

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
