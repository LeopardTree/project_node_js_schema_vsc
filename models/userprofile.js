const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    psw: {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;