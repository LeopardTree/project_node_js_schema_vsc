const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    // date: {
    //     type: String,
    //     required: true
    // },
    // username: {
    //     type: String,
    //     required = true
    // },
    text: {
        type: String,
        required = true
    },
    phase: {
        type: String,
        required = true
    }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;