// let $ = require('jquery')
// let filename = 'contacts'
// let sno = 0

// $('#add-to-list').on('click', () => {
//    let name = $('#Name').val()
//    let email = $('#Email').val()

//    fs.appendFile('contacts', name + ',' + email + '\n')

//    addEntry(name, email)
// })

// function addEntry(name, email) {
//    if(name && email) {
//       sno++
//       let updateString = '<tr><td>'+ sno + '</td><td>'+ name +'</td><td>' 
//          + email +'</td></tr>'
//       $('#contact-table').append(updateString)
//    }
// }

// function loadAndDisplayContacts() {  
   
//    //Check if file exists
//    if(fs.existsSync(filename)) {
//       let data = fs.readFileSync(filename, 'utf8').split('\n')
      
//       data.forEach((contact, index) => {
//          let [ name, email ] = contact.split(',')
//          addEntry(name, email)
//       })
   
//    } else {
//       console.log("File Doesn\'t Exist. Creating new file.")
//       fs.writeFile(filename, '', (err) => {
//          if(err)
//             console.log(err)
//       })
//    }
// }

// loadAndDisplayContacts()

const remote = require('electron').remote;
let fs = require('fs')
let filename = "todo"

function getDateElement() {
    var date = new Date();
    var monthDict = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December",
    };
    var dayDict = {
        0: "Sun",
        1: "Mon",
        2: "Tues",
        3: "Wed",
        4: "Thurs",
        5: "Fri",
        6: "Sat",
    };
    var date_string_day = date.getDay();
    var date_string_month = date.getMonth();
    var date_string = (dayDict[date_string_day] + ' ' + date.getDate() + ' ' + monthDict[date_string_month]);
    document.getElementById('date').innerHTML = date_string;
    return date_string;
}

function handleWindowControls() {
    let win = remote.getCurrentWindow();
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });
    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });
}

class list_items {
    constructor(item_name, day_to_complete) {
        this.item_name = item_name
        this.day_to_complete = day_to_complete
        this.completed = false
    }
    get_item_name() {
        return this.item_name
    }
    get_day_to_complete() {
        return this.day_to_complete
    }
}

function loadAndDisplayTodo() {  
   
   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      
      data.forEach((contact, index) => {
         let [ item_name, day_to_complete ] = contact.split(',')
         addEntry(item_name, day_to_complete)
      })
   
   } else {
      console.log("File Doesn\'t Exist. Creating new file.")
      fs.writeFile(filename, '', (err) => {
         if(err)
            console.log(err)
      })
   }
}

window.onload = function(){
date_string = getDateElement()
    handleWindowControls()
}