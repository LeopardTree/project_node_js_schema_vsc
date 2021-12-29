//this file is not in use

const dt = require('../app.js')

addGreenBorder();

var dateShowing = dt; 
// alert(x);  // now JS variable 'x' has the uid that's passed from the node backend.
addGreenBorder();
function addGreenBorder() {
    var today = new Date();
    if(dateShowing == today.toLocaleDateString()){
        var time = today.getHours();
        var timemin = today.getMinutes();
        var hourandmin = time * 100 + timemin;
        var element1 = document.getElementById('div1');
        var element2 = document.getElementById('div2');
        var element3 = document.getElementById('div3');
        if (time >= 9 && time < 12) {
            //make greenborder on div1
            element1.style.border = "6px solid green";
            element1.style.animation = "pulse 4s infinite";
            //make normal border colour on div2 and div3
            element2.style.border = "0px dotted red";
            element3.style.border = "0px dotted red";
        }
        else if (time >= 12 && time < 13) {
            //make greenborder on div2
            element2.style.border = "6px solid green";
            element2.style.animation = "pulse 4s infinite";
            //make normal border color on div1 and div3
            element1.style.animation = "";
            element1.style.border = "0px dotted red";
            element3.style.border = "0px dotted red";

        }
        else if (time >= 13 && hourandmin < 1630) {
            //make greenborder on div3
            element3.style.border = "6px solid green";
            element3.style.animation = "pulse 4s infinite";
            //make normal border colour on div1 och div2
            element1.style.animation = "";
            element2.style.animation = "";
            element2.style.border = "0px dotted red";
            element1.style.border = "0px dotted red";
        }
        else {
            //make all normal borders
            element1.style.border = "0px dotted red";
            element2.style.border = "0px dotted red";
            element3.style.borde = "0px dotted red";
            //alternativt ta bort alla divs och skriv bara ut när nästa lektion börjar
        }
    }
}