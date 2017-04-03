// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    profileInfo  : {
        firstName: String,
        lastName: String
    },
    // postings         : {
    //     title        : String,
    //     timeCommitment: String,
    //     description  : String,
    //     availability : {Sunday:{
    //
    //         }, Monday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //         }, Tuesday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //         }, Wednesday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //         }, Thursday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //         }, Friday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //         }, Saturday:{
    //
    //             Morning: Boolean,
    //
    //             Afternoon: Boolean,
    //
    //             Evening: Boolean
    //
    //     }},
    // },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
