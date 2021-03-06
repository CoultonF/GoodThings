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

path = require('path'),

formidable = require('formidable'),

morgan = require('morgan'),

profile = require('./src/app/profile'),

bits = new bitString(),

port = 3000,

postings = require('./src/models/postings'),

homeRouter = express.Router();

signinRouter = express.Router();

signupRouter = express.Router();

loginRouter = express.Router();

chatRouter = express.Router();

landingPageRouter = express.Router();

businessInfoRouter = express.Router();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:true}));

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

app.get('/api/listPostings', function (req, res) {
    // find all postings
    var query = postings.find();

    // execute the query at a later time
    query.exec(function (err, posting) {
        if (err) return handleError(err);
        res.json(posting);
    });
});

app.get('/profile', isLoggedIn, function(req, res) {
    res.redirect('/home');
});
app.get('/home', isLoggedIn, function(req, res) {
    res.sendFile(__dirname + '/user-page.html');
});
//Cannot logout using a Google account - the user will have to log out via google.ca to log out of the app
app.get('/logout', isLoggedIn, function(req, res) {
    console.log("tried logging out");
    req.logout();
    res.redirect('/');
});
app.post('/editProfile', isLoggedIn, function(req, res) {
    var profilePhoto = req.body.profilePhoto;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var biography = req.body.biography;
    var interests = req.body.interests;

    console.log(req.body.profilePhoto);
    console.log(req.body.interests);
    console.log(req.body.firstName);
    var data = {"firstName":firstName,"lastName":lastName,"biography":biography,"interests":interests};
    profile.updateProfile(req.user.local.email, data);
    console.log('EMAIL: '+req.user.local.email);
    res.redirect("/");

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

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/signin'
        }));

//profileInfo is undefined when it is defined as per the mongodb
app.post('/checkData', function(req, res) {
    if(req.isAuthenticated())
    {
        var data ={
                "firstName":req.user.profileInfo.firstName,
                "lastName":req.user.profileInfo.lastName,
                "biography":req.user.profileInfo.biography,
                "interests":req.user.profileInfo.interests
              };
        console.log(req.user.google.name);
        console.log(data);
        res.send(JSON.stringify(data));
    }
});

app.post('/getNameEmail', function(req, res) {
    if(req.isAuthenticated())
    {
        var data;
        if(req.user.profileInfo.firstName === undefined)
        {
            data ={
                "name":"Unknown",
                "email":req.user.local.email
            };
        }
        else
        {
            data = {
                "name":req.user.profileInfo.firstName+" "+req.user.profileInfo.lastName,
                "email":req.user.local.email
            };
        }
        console.log(req.user.google.name);
        res.send(JSON.stringify(data));
    }
});

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

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

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



app.use(function(req, res) {

    res.redirect('/');

});
