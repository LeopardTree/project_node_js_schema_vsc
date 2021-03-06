// imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = 3000;
const fs = require('fs');
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/userprofile');
const Comment = require('./models/usercomment');

// global fields
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
var loggedinUser = null;
var comment = ""; var comments = [];
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
    left = req.body.left;
    right = req.body.right;
    comment = req.body.commentInput;
    if(typeof comment !== 'undefined' && loggedinUser){
        const _comment = new Comment({
            date: new Date(dt),
            username: loggedinUser.email,
            comment: comment,
            firstname: loggedinUser.firstname,
            lastname: loggedinUser.lastname
        });
        _comment.save()
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
    }
    res.redirect('/');
});

app.post('/vecka', function(req, res) {
    weekleft = req.body.left;
    weekright = req.body.right;
    dt = jump7days(dt);
    res.redirect('/vecka');
});

app.post('/register', function(req, res) {
    let newfirstname = req.body.firstname;
    let newlastname = req.body.lastname;
    let newphone = req.body.phone;
    let newemail = req.body.email;
    let newpsw = req.body.psw;
    let isadmin = false;
    if(newemail.includes("@molk.com") || newemail.includes("@molk.se")){
        isadmin = true;
    }
    // check if email already exists
    User.findOne({ email: newemail})
        .then(doc =>{
            //must check if exists before saving new user because of it's asynchronous
            if(doc != null){
                email_in_db = newemail;
                res.redirect('/register_tryagain');
            }
            else{
                const user = new User({
                    firstname: newfirstname,
                    lastname: newlastname,
                    phone: newphone,
                    email: newemail,
                    psw: newpsw,
                    admin: isadmin
                    
                });
                user.save()
                .then((result) =>{
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log(err);
                    res.send(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/');
        });
});

app.post('/login', function(req, res) {
    let _email = req.body.email;
    let _psw = req.body.password;
    // check if email already exists
    User.findOne({ email: _email})
        .then(doc =>{
            if(doc != null){
                if(doc.psw == _psw){
                    loggedinUser = doc;
                    if(doc.admin == true){
                        //res.send('admin log in successful!');
                        res.redirect('/');
                    }
                    else{
                        //res.send('log in successful!');
                        res.redirect('/');
                    }
                    
                }
                else{
                    res.send('wrong password');
                }
            }
            else{
                res.send("email doesn't exist");
            }
        })
        .catch((err) => {
            console.log(err);
            res.send('404');
        });
});

app.post('/add_schedule', (req, res) =>{
    let newdate = req.body.date;
    console.log(newdate);
    try{
        let datearr = newdate.split('-');
        console.log(datearr);
        // month starts with 0
        newdate = new Date(datearr[0], datearr[1]-1, datearr[2], 24); 
        console.log(newdate);
    }
    catch(err){
        console.log(err);
    }
    

    let newloc = req.body.location;
    let newteacher1 = req.body.teacher1;
    let newam = req.body.morning;
    let newpm = req.body.afternoon;
    let newcourse = req.body.course;
    let newteacher2 = req.body.teacher2;
    let newtopic = req.body.topic;
    let newamcom = req.body.morningcomment;
    let newpmcom = req.body.afternooncomment;

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
                res.redirect('/add_schedule');
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
        }
    })
    .catch((err) => {
       console.log(err);
       res.send(err);
    });
});

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');


//app.gets // the async might not work properly...
app.get('/', (req, res) => {
    dtstr = new Date(dt).toLocaleDateString();
    Schedule.findOne({ date: { $gte: new Date(dtstr), $lt: new Date(addDay(dtstr)) }
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
            Comment.find({ date: { $gte: new Date(dtstr), $lt: new Date(addDay(dtstr)) }
                })
            .sort({createdAt: 'desc'})
            .then(result =>{
                comments = result;
                res.render('startpage', { placeOut: place, amOut: am, pmOut: pm, dateOut: dtstr, comments: comments});
            })
        // res.send(am + pm + place);
        
    })
    .catch((err) => {
       console.log(err);
    });
});
app.get('/add_schedule', (req, res) => {
    if(loggedinUser && loggedinUser.admin == true){
        res.render('addnewday');
    }
    else{
        res.redirect('/');
    }
    
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
app.get('/all_users', (req, res) => {
    User.find().sort({ lastname : -1})
        .then(doc =>{
            res.send(doc);
           
        })
        .catch((err) => {
            console.log(err);
            res.send('404');
        });
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