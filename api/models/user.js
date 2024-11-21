const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        // unique: true,
          /* The `match` property in the email field of the user schema is a validation rule in
          Mongoose that specifies a regular expression pattern that the email field value must
          match. */
        //   match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password :{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);