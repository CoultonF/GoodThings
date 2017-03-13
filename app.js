var express = require('express'),

bodyParser = require('body-parser'),

fs = require('fs'),

http = require('http'),

app = express(),

helmet = require('helmet'),

passport = require('passport'),

port = 3000,

homeRouter = express.Router();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(helmet());

homeRouter.route('/').get(function(req, res){

    res.sendFile(__dirname + '/index.html');

});

app.get('/', function(req, res){

//TODO: authenticate token if not valid or null

    if(false)

        res.sendFile(__dirname + '/index.html');

    else
        //TODO: create sign in page
        res.sendFile(__dirname + '/sign-in-page.html');

});

app.use('/home', homeRouter);

app.listen(port, function(err){

    if(err){

        console.log('Error: ' + err);

    }

    else

        console.log('Server started at localhost:' + port);

});
