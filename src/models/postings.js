// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  postings         : {
      title        : String,
      timeCommitment: String,
      description  : String,
      availability : {
        Sunday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Monday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Tuesday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Wednesday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Thursday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Friday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

        }, Saturday:{

            Morning: Boolean,

            Afternoon: Boolean,

            Evening: Boolean

    }},
}
});
