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
    
    comment1 = req.body.commentInput;
    //console.log(comment1);
    //createWritestring();

    left = req.body.left,
    right = req.body.right;
    if(right == "true"){left = "false"};
    if(left == "true"){right = "false" };
    dt = selectDate(dt);
    readData();
    
    // writeToFile();
    //console.log(fs.readFileSync('public/data/datatest.txt', "utf8"));
    res.render('startpage', { text: place, text2: am, text3: pm, text4: dt, text5: comment1})
});


// Get values from data at right date
var comment1 = "";
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
    readFile();
    //console.log(array);
    for(i in array) {
        array[i] = array[i].toString().split(", ");
        if(array[i][0] == dt){     
            place = array[i][1];
            am = array[i][2];
            pm = array[i][4];
            // if(array.length > 5){
            //     comment1 = array[i][5];
            // }
            
            //comment2 = array[i][6];
        }
    }
    
}

function writeToFile(){
    for(i in array) {
        array[i] = array[i].toString();
        if(i == 0){
            fs.writeFileSync('public/data/datatest.txt', array[i], {
                encoding: "utf8",
                flag: "w"
              });
        }
        else if(i == array.length -1){
            fs.writeFileSync('public/data/datatest.txt', array[i], {
                encoding: "utf8",
                flag: "a+"
              });
        }
        else
            var temp = array[i] + '\n';
            fs.writeFileSync('public/data/datatest.txt', temp, {
                encoding: "utf8",
                flag: "a+"
              });
    }
}

//writing files
// fs.writeFile('./docs/blog1.txt', 'hello, world', () =>{
//     console.log('file was written');
// });


// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('startpage', { text: place, text2: am, text3: pm, text4: dt, text5: comment1})
})


// listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))

