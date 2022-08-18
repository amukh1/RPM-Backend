const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    UserName: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Packages: {
        type: Array,
        required: true,
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;
