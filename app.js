// imports
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');

// variables
var comment1 = "";
var comment2 = "";
var place = "";
var am = "";
var pm = "";
var left = ""; right = "";
var array = "";
var arr = "";
var dayview = [];
var x = "";
if (typeof dt === 'undefined') {
    dt = new Date();
    dt = dt.toLocaleDateString();
    }
var dt = selectDate();

// connect to mongoDb and then listen to port
const dbURI = 'mongodb+srv://schema_hemsida:julprojektoop2@schemamju20.5hgnt.mongodb.net/schemamju20?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(port, () => console.info(`Listening on port ${port}`)))
.catch((err) => console.log(err));

// static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/data', express.static(__dirname + 'public/data'));

// access data from client. https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// middleware
app.use(function (req, res, next) {
    
    // dayview = findInDb();
    dt = selectDate(dt);
    next()
});

// mongoose and mongo sandbox routes
app.post('/add_schedule', (req, res) =>{
    newdate = req.body.dateInput;
    newloc = req.body.locationInput;
    newteacher1 = req.body.teacher1Input;
    newam = req.body.amInput;
    newpm = req.body.pmInput;
    newcourse = req.body.courseInput;
    const schedule = new Schedule({
        date: newdate,
        location: newloc,
        am: newam,
        pm: newpm,
        teacher1: newteacher1,
        course: newcourse
    });
    schedule.save()
    .then((result) =>{
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
    //res.send(newdate+ " "+ newloc+ " "+newteacher1+" "+ newam + " " + newpm + " " + newcourse)
});


// problem with assigning variable to document_object because of async... so using findOne directly in app.get for now 
// async function findInDb(){
//     x = await Schedule.find();
// }
//app.posts
app.post('/', function(req, res) {
    left = req.body.left,
    right = req.body.right;
    res.redirect('/');
});

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

//app.gets
app.get('/', (req, res) => {
    Schedule.findOne({ date: dt })
    .then(doc =>{
        if(doc != null){
            am = doc.am;
            pm = doc.pm;
            place = doc.location;
        }
        else{
            am = "";
            pm = "";
            place = "";
        }
        // res.send(am + pm + place);
        res.render('startpage', { text: place, text2: am, text3: pm, text4: dt, text5: '', text6: ''});
    })
    .catch((err) => {
       console.log(err);
    });
});
app.get('/add_schedule', (req, res) => {
    res.render('addnewday');
});

// functions

// Functions for next or previous day
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
function addDay(date) {
    var result = new Date(date);
    result.setDate(result.getDate() + 1);
    result = result.toLocaleDateString();
    return result;
}
function previousDay(date){
    var result = new Date(date);
    result.setDate(result.getDate() - 1);
    result = result.toLocaleDateString();
    return result;
}
function selectDate(){
    if(left == "true"){
        dt = previousDay(dt);
        left = "false";
    }
    if(right == "true"){
        dt = addDay(dt);
        right = "false";
    }
    return dt;
}