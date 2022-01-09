// imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = 3000;
const fs = require('fs');
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/userprofile')

// variables
var comment1 = "";
var comment2 = "";
var place = "";
var am = "";
var pm = "";
var left = ""; var right = ""; var weekleft = ""; var weekright = "";
var week = "";
var day = "";
var dtstr = "";
var amMon, pmMon, amTue, pmTue, amWed, pmWed, amThu, pmThu, amFri, pmFri, locMon, locTue, locWed, locThu, locFri;
if (typeof dt === 'undefined') {
    dt = new Date();
    }
var email_in_db;
var tempmon = new Date(dt);
var tempsat = "";
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
    next()
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

app.post('/vecka', function(req, res) {
    weekleft = req.body.left;
    weekright = req.body.right;
    dt = jump7days(dt);
    res.redirect('/vecka');
});

app.post('/register', function(req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let phone = req.body.phone;
    let email = req.body.email;
    let psw = req.body.psw;
    // check if email already exists
    Schedule.findOne({ email: email})
        .then(doc =>{
            if(doc == null){
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    email: email,
                    psw: psw
                    
                });
                user.save()
                .then((result) =>{
                    res.send(result)
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect('/register');
                });
            }
            else{
                email_in_db = email;
                res.redirect('/register_tryagain');
            }
        })
        .catch((err) => {
        console.log(err);
        });
    
    
    //res.redirect('/');
});

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

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');


//app.gets
app.get('/', (req, res) => {
    
    dtstr = new Date(dt).toLocaleDateString();
    Schedule.findOne({ date: { $gte: new Date(dtstr), $lt: new Date(addDay(dtstr))
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
    amMon = pmMon = amTue = pmTue = amWed = pmWed = amThu = pmThu = amFri = pmFri = locMon = locTue = locWed = locThu = locFri = "";
    week = new Date(dt).getWeek();
    //gets the daynumber in the week sunday = 0 --> saturday = 6
    day = new Date(dt).getDay();
    findBoundarydates();
    tempmon = new Date(tempmon).toLocaleDateString();
    tempsat = new Date(tempsat).toLocaleDateString();

    Schedule.find({date: {
        $gte: tempmon, 
        $lt: tempsat
        }
    })
    .then(days =>{
        
        days.forEach(day => {
            let weekday = new Date(day.date).getDay();
            if(weekday == 1){
                amMon = day.am;
                pmMon = day.pm;
                locMon = day.location;
            }
            if(weekday == 2){
                amTue = day.am;
                pmTue = day.pm;
                locTue = day.location;
            }
            if(weekday == 3){
                amWed = day.am;
                pmWed = day.pm;
                locWed = day.location;
            }
            if(weekday == 4){
                amThu = day.am;
                pmThu = day.pm;
                locThu = day.location;
            }
            if(weekday == 5){
                amFri = day.am;
                pmFri = day.pm;
                locFri = day.location;
            }
            tempmon = new Date(dt);
            tempsat = "";
            
            
        });
        res.render('vecka', {weekOut: week, 
            amMonOut: amMon, pmMonOut: pmMon, amTueOut: amTue, pmTueOut: pmTue, amWedOut: amWed, pmWedOut: pmWed, 
            amThuOut: amThu, pmThuOut: pmThu, amFriOut: amFri, pmFriOut: pmFri, locMonOut: locMon, locTueOut: locTue, locWedOut: locWed, locThuOut: locThu, locFriOut: locFri
        });
        //res.send(doc);
        
    })
    .catch((err) => {
       console.log(err);
    });
    
    
});

app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/register_tryagain', (req, res) => {
    res.render('register_tryagain', {email: email_in_db})
});

app.get('/login', (req, res) => {
    res.render('login')
});

// functions

// Functions for next or previous day
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
function addDay(date) {
    let result = new Date(date);
    result = result.setDate(result.getDate() + 1);
    return result;
}
function previousDay(date){
    let result = new Date(date);
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
function jump7days(){
    let result = new Date(dt);
    if(weekleft == "true"){
        result = result.setDate(result.getDate() - 7);
        weekleft = "false";
    }
    if(weekright == "true"){
        result = result.setDate(result.getDate() + 7);
        weekright = "false";
    }
    return result;
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
    tempmon = new Date(dt);
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
    if(day == 6){
        tempmon = tempmon.setDate(tempmon.getDate() - 5);
    }
    if(day == 0){
        tempmon = tempmon.setDate(tempmon.getDate() - 6);
    }
    tempsat = new Date(tempmon);
    tempsat = tempsat.setDate(tempsat.getDate() + 5);
}