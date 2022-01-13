const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usercommentSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Comment = mongoose.model('Comment', usercommentSchema);
module.exports = Comment;