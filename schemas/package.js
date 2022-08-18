const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    Downloads: {
        type: Number,
        required: true,
    },
    DownloadsL: {
        type: Number,
        required: true,
    },
    Readme: {
        type: String,
        // required: true,
    },
    Author: {
      type:String,
    }
});

let User = mongoose.model('Packages', userSchema);

module.exports = User;
