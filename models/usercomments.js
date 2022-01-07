const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usercommentsAmSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required = true
    },
    comment: {
        type: String,
        required = true
    }
}, {timestamps: true});
