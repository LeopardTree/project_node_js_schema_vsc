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

// Get values from data at right date
var place = "";
var am = "";
var pm = "";
//reading files
fs.readFile('public/data/data.txt', (err, data) => {
    if(err){
      console.log(err);  
    }
    var dt = new Date();
    dt = dt.toLocaleDateString();
    var array = data.toString().split(/\r?\n/);
    for(i in array) {
        array[i] = array[i].toString().split(",");
        if(array[i][0] == dt){
            place = array[i][1];
            am = array[i][2];
            pm = array[i][4];
        }
    }
})

// console.log('last line');

// //writing files
// fs.writeFile('./docs/blog1.txt', 'hello, world', () =>{
//     console.log('file was written');
// });


// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('', (req, res) => {
    res.render('startpage', { text: place, text2: am, text3: pm})
})


// listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))