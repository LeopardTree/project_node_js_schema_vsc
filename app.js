// imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
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
var dtObject = "";
var week = "";
var day = "";
var dtstr = "";
if (typeof dt === 'undefined') {
    dt = new Date();
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
    dt = selectDate(dt);
    dtstr = new Date(dt).toLocaleDateString();
    //dtObject = toDateObject(dt);
    week = new Date(dt).getWeek();
    //gets the daynumber in the week sunday = 0 --> saturday = 6
    day = new Date(dt).getDay();
    console.log(new Date(dt));
    // dayview = findInDb();
    next()
});

// mongoose and mongo sandbox routes
app.post('/add_schedule', (req, res) =>{
    let newdate = req.body.dateInput;
    let newloc = req.body.locationInput;
    let newteacher1 = req.body.teacher1Input;
    let newam = req.body.amInput;
    let newpm = req.body.pmInput;
    let newcourse = req.body.courseInput;
    let newteacher2 = req.body.teacher2Input;
    let newtopic = req.body.topicInput;
    let newamcom = req.body.amcomInput;
    let newpmcom = req.body.pmcomInput;

    newarr = [newloc, newteacher1, newam, newpm, newcourse, newteacher2, newtopic, newamcom, newpmcom];
    
    // check if date already exists
    Schedule.findOne({ date: { $gte: new Date(newdate), $lt: new Date(addDay(dt))
        }
    })
    .then(doc =>{
        if(doc == null){
            const schedule = new Schedule({
                date: newdate,
                location: newloc,
                am: newam,
                pm: newpm,
                teacher1: newteacher1,
                course: newcourse,
                teacher2: newteacher2,
                topic: newtopic,
                amcom: newamcom,
                pmcom: newpmcom
            });
            schedule.save()
            .then((result) =>{
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
                res.redirect('add_schedule');
            });
        }
    })
    .catch((err) => {
       console.log(err);
    });
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
    Schedule.findOne({ date: { $gte: new Date(dt), $lt: new Date(addDay(dt))
            }
        })
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
        res.render('startpage', { placeOut: place, amOut: am, pmOut: pm, dateOut: dtstr, comAmOut: '', comPmOut: ''});
    })
    .catch((err) => {
       console.log(err);
    });
});
app.get('/add_schedule', (req, res) => {
    res.render('addnewday');
});

app.get('/vecka', (req, res) => {
    var boundaries = findBoundarydates();
    Schedule.find({ date: { $gte: new Date(boundaries[0]), $lt: new Date(boundaries[1])
        }
    })
    .then(doc =>{
        
        // res.send(am + pm + place);
        res.send(doc);
    })
    .catch((err) => {
       console.log(err);
    });



    //res.render('vecka', {dateOut: week, placeOut: place})
});

app.get('/register', (req, res) => {
    res.render('register', {dateOut: dtstr, placeOut: place})
});

app.get('/login', (req, res) => {
    res.render('login', {dateOut: dtstr, placeOut: place})
});

// functions

// Functions for next or previous day
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
function addDay(date) {
    var result = new Date(date);
    result = result.setDate(result.getDate() + 1);
    return result;
}
function previousDay(date){
    var result = new Date(date);
    result = result.setDate(result.getDate() - 1);
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
// https://weeknumber.com/how-to/javascript
// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
function toDateObject(dt){
    var timestamp = Date.parse(dt);
    return new Date(timestamp);
}
function findBoundarydates(){
    let tempmon = dt;
    let tempsat = "";
    if(day == 1){
        tempmon = new Date(tempmon);
    }
    if(day == 2){
        tempmon = tempmon.setDate(tempmon.getDate() - 1);
        
    }
    if(day == 3){
        tempmon =  tempmon.setDate(tempmon.getDate() - 2);
    }
    if(day == 4){
        tempmon = tempmon.setDate(tempmon.getDate() - 3);
    }
    if(day == 5){
        tempmon = tempmon.setDate(tempmon.getDate() - 4);
    }
    tempsat = new Date(tempmon);
    tempsat = tempsat.setDate(tempsat.getDate() + 4);

    return [tempmon, tempsat];
}