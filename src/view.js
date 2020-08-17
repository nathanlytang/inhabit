const remote = require("electron").remote;
let fs = require("fs");
let $ = require("jquery");
const { app, BrowserWindow } = require("electron").remote;
const url = require("url");
const path = require("path");
let filename = path.join(__dirname, "todofile");

// Resize table on window resize

function windowResize() {
    var bodyElem = document.querySelector("#window-body");
    var backImgElem = document.querySelector("#background-image");
    var newheight = (bodyElem.clientHeight - backImgElem.clientHeight - 60)
    document.getElementById("todo_list").style.height = newheight + "px";
}

// Date functions

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
    var date_string =
        dayDict[date_string_day] +
        " " +
        date.getDate() +
        " " +
        monthDict[date_string_month];
    document.getElementById("date").innerHTML = date_string;
    return date_string;
}

// Window buttons

function handleWindowControls() {
    let win = remote.getCurrentWindow();
    document.getElementById("min-button").addEventListener("click", (event) => {
        win.minimize();
    });
    document.getElementById("close-button").addEventListener("click", (event) => {
        win.close();
    });
}

// File System List and Classes

class list_items {
    constructor(item_name, day_to_complete) {
        this.item_name = item_name;
        this.day_to_complete = day_to_complete;
        this.completed = false;
    }
    get_item_name() {
        return this.item_name;
    }
    get_day_to_complete() {
        return this.day_to_complete;
    }
}

// Read file and get data

function getData() {
    if (fs.existsSync(filename)) {
        let data = fs.readFileSync(filename, "utf8").split("\n");
        return data;

    } else {
        console.log("File Doesn't Exist. Creating new file.");
        fs.writeFile(filename, "", (err) => {
            if (err) console.log(err);
        });
        return null;
    }
}

// Print Data

function printData(data, table) {

    table.innerHTML = "";
    for (item of data) {

        if (item == "" || /^ *$/.test(item)) {
            // If item blank, pass
        } else {
            if (!isNaN(item) && (function(x) { return (x | 0) === x; })(parseFloat(item))) { // Check if the entry is a number
                item = item + "‏‏‎ ‎"; // Add a space to the end of the entry
            };

            let row = table.insertRow(item);
            let check = row.insertCell(0);
            let title = row.insertCell(1);
            let index = data.indexOf(item);

            row.classList.add("table_row");
            title.innerHTML = item;
            check.innerHTML = `<label class="checkbox-label"><input type="checkbox"><span class="checkbox-custom"></span></label>`;

            check.addEventListener("change", () => {
                data.splice(data.length - row.rowIndex - 1, 1);
                table.deleteRow(row.rowIndex);

                fs.writeFileSync(filename, "", "utf8", (err) => {
                    if (err) throw err;
                });

                for (item of data) {
                    if (item == "" || /^ *$/.test(item)) {
                        // If item blank, pass
                    } else {
                        fs.appendFileSync(filename, "\n" + item, "utf8", (err) => {
                            if (err) throw err;
                        });
                    }
                };
            });
        }
    }
    return table;
}

// Add data entry

// function addEntry(item_name, day_to_complete) {
//     if (item_name && day_to_complete) {
//         let updateString =
//             "<tr><td>" + item_name + "</td><td>" + day_to_complete + "</td></tr>";
//         $("#todo_table").append(updateString);
//         console.log(updateString);
//     }
// }

// Detect Enter on Input Field

document.getElementById("input-note-field").onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.code || e.which; // User press enter
    if (keyCode == "Enter") {
        var note = document.getElementById("input-note-field").value;
        if (note == "" || /^ *$/.test(note)) {
            // If data is just whitespace
            return;
        } else {
            fs.appendFileSync(filename, "\n" + note, "utf8", (err) => {
                // Append data to file
                if (err) throw err;
                console.log("Data appended");
            });

            // Update table with data
            let data = fs.readFileSync(filename, "utf8").split("\n");
            const table = document.getElementById("todo_table");
            printData(data, table);

        }
        document.getElementById("input-note-field").value = ""; // Delete values from input field
    }
};

// Main

window.onload = function () {
    date_string = getDateElement();
    handleWindowControls();
    // loadAndDisplayTodo()
    data = getData();
    const table = document.getElementById("todo_table");
    printData(data, table);
};

// Calendar Appear on Input Focus (Ignore for now)

// $(document).ready(function () {
//     // $('#input-note-field').focus(function() {
//     //     $('#calendar-image').toggle();
//     //     console.log('calendar focus')
//     // });

//     if ($('#input-note-field').is(':focus') || $('#calendar-image').is('focus')) {
//         $('#calendar-image').focus()
//     }
//     else {
//         console.log('blurring')
//         $('#calendar-image').blur()
//     }
//     // $('#calendar-image').focus(function() {
//     //     $('#input-note-field').blur()
//     // })
// });

// document.querySelector('input[type="note"').addEventListener('focus', (event) => {
//     $('#calendar-image').toggle()
// })

// let calendarWin
// function createCalendar() {
//     calendarWin = new BrowserWindow({
//         width: 200,
//         height: 700,
//         frame: false,
//         transparent: false,
//         fullscreen: false,
//     });
//     calendarWin.loadURL(url.format ({
//         pathname: path.join(__dirname, 'calendar.html'),
//         protocol: 'file:',
//         slashes: true,
//      }));
// };

// function callCalendar() {
//     let calendarWin = new BrowserWindow({
//         width: 300,
//         height: 400,
//         //    frame = false
//         webPreferences: {
//             devTools: true,
//             nodeIntegration: true,
//         },
//     });
//     calendarWin.setMenu = null;
//     calendarWin.setMenuBarVisibility(false);
//     calendarWin.on("close", function () {
//         calendarWin = null;
//     });
//     calendarWin.loadURL(path.join("file://", __dirname, "calendar.html"));
//     calendarWin.show();
// }