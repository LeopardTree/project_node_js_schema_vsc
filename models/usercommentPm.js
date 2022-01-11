const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usercommentPmSchema = new Schema({
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

const CommentPm = mongoose.model('CommentPm', usercommentPmSchema);
module.exports = CommentPm;