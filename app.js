// imports
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');

// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/data', express.static(__dirname + 'public/data'))

// Access data from client. https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.post('/', function(req, res) {
    left = req.body.left,
    right = req.body.right;
    if(right == "true"){left = "false"};
    if(left == "true"){right = "false" };
    dt = selectDate(dt);
    readData();
    left = "false";
    right = "false";
    res.render('startpage', { text: place, text2: am, text3: pm, text4: dt})
    
});


// Get values from data at right date
var place = "";
var am = "";
var pm = "";
var left = "", right = "";
var addJavascript = "";
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

function readData(){
    fs.readFile('public/data/data.txt', (err, data) => {
        if(err){
          console.log(err);  
        }
        
        var array = data.toString().split(/\r?\n/);
        for(i in array) {
            array[i] = array[i].toString().split(",");
            if(array[i][0] == dt){
                place = array[i][1];
                am = array[i][2];
                pm = array[i][4];
                comment1 = array[i][5];
                comment2 = array[i][6];
            }
        }
    })
}
readData();


// //writing files
// fs.writeFile('./docs/blog1.txt', 'hello, world', () =>{
//     console.log('file was written');
// });


// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('startpage', { text: place, text2: am, text3: pm, text4: dt})
})


// listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))

