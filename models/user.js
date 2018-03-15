// Import mongoose & configure
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create convenience methods
/* Hashing Method */
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

/* Validate Password */
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


// Export Model

module.exports = mongoose.model('User', userSchema);