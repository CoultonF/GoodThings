var express = require('express'),

bodyParser = require('body-parser'),

fs = require('fs'),

http = require('http'),

app = express(),

helmet = require('helmet'),

passport = require('passport'),

port = 3000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(helmet());

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');

});

app.listen(port, function(err){

    if(err){

        console.log('Error: ' + err);

    }

    else

        console.log('Server started at localhost:' + port);

});
