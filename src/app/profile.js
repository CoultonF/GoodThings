var User            = require('../models/user');

module.exports = {

    //insert profile info

    updateProfile : function(email, userData){
        console.log(userData);
        User.update({"email":"a@a.ca"}, {$set:{profileInfo:userData}}, { strict: false }, callback);
        function callback (err, numAffected) {
            if (err)
                console.log(err);

            console.log("Number affected: "+JSON.stringify(numAffected));
        }
    },

    deleteProfile : function(email) {
        User.remove({ 'local.email' : email }, function(){

            console.log("Removed: "+ email);

        });
    }

    //


};
