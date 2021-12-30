// imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = 3000;
const fs = require('fs');


// Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/data', express.static(__dirname + 'public/data'));

// Access data from client. https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

//middleware
// Get values from data at right date
var comment1 = "";
var comment2 = "";
var place = "";
var am = "";
var pm = "";
var left = "", right = "";
var array = "";
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
if (typeof dt === 'undefined') {
dt = new Date();
dt = dt.toLocaleDateString();
}
var dt = selectDate();
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
function readFile(){
    const data = fs.readFileSync('public/data/data.txt',
            {encoding:'utf8', flag:'r'});
    array = data.toString().split(/\r?\n/);
    
}
function readData(){
    for(i in array) {
        array[i] = array[i].toString().split(",");
        if(array[i][0] == dt){     
            place = array[i][1];
            am = array[i][2];
            pm = array[i][4];
            comment1 = array[i][5];
            comment2 = array[i][6];
            break;
        }
        else 
            am, pm , place, comment1, comment2 = "";
    }
}
function addData(){
    for(i in array) {
        if(array[i][0] == dt){    
            if(typeof comment1 === 'string'){
                //console.log(comment1);
                if(array.length < 6){
                    array[i].push(comment1);
                }
                else 
                    array[i][5] = comment1;
            }
            if(typeof comment2 === 'string'){
                //console.log(comment2);
                if(array.length < 7){
                    array[i].push(comment2);
                }
                else if(array.length < 6){
                    array[i].push('');
                    array[i].push(comment2);
                }
                else 
                    array[i][6] = comment2;
            }
            
        }
    }
    //console.log(array);
}
function writeToFile(){
    // console.log(array.join('\n'));
    var datatext = array.join('\n');
    fs.writeFile('public/data/data.txt', datatext, function(err){
        if (err) return console.log(err);
    });
}

app.use(function (req, res, next) {
    
    readFile();
    readData();
    console.log('data have been read');
    console.log('---');
    next()
  });

//app.posts
app.post('/', function(req, res) {
    
    

    left = req.body.left,
    right = req.body.right;
    if(right == "true"){left = "false"};
    if(left == "true"){right = "false" };
    dt = selectDate(dt);

    if(typeof req.body.commentInput !== 'undefined'){
        comment1 = req.body.commentInput.toString();
        addData();
        console.log('data added');
        console.log('---');
        writeToFile();
        console.log('data written');
    }
    if(typeof req.body.commentInput2 !== 'undefined'){
        comment2 = req.body.commentInput2.toString();
        addData();
        console.log('data added');
        console.log('---');
        writeToFile();
        console.log('data written');
    }
    
    //console.log(fs.readFileSync('public/data/datatest.txt', "utf8"));
    // res.render('startpage', { text: place, text2: am, text3: pm, text4: dt, text5: comment1})
    res.redirect('/');
});

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

//app.gets
app.get('/', (req, res) => {
    res.render('startpage', { text: place, text2: am, text3: pm, text4: dt, text5: comment1, text6: comment2})
});

app.get('/vecka', (req, res) => {
    res.render('vecka', {text4: dt, text: place})
});


// listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));

