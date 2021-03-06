const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    am: {
        type: String,
        required: true
    },
    pm: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: false
    },
    course: {
        type: String,
        required: true
    },
    teacher1: {
        type: String,
        required: true
    },
    teacher2: {
        type: String,
        required: false
    },
    teacherCommentAm: {
        type: String,
        required: false
    },
    teacherCommentPm: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;