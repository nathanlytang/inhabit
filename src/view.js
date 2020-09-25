const remote = require("electron").remote;
let fs = require("fs");
let $ = require("jquery");
const { app, BrowserWindow } = require("electron").remote;
const url = require("url");
const path = require("path");
let filename = path.join(__dirname, "todo.json");

var index_count = 0

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
        saveTodo();
        win.close();
    });
}

// File System List and Classes
function saveTodo() {
    const table = document.getElementById('todo_table');
    var json_data = {};
    var items = json_data['items'] = [];

    for (i = 0; i < table.rows.length; i++) {
        var nested_data = {};
        var task_formatted = table.rows[i].childNodes[1].innerHTML;
        task_formatted = task_formatted.replace('<strike>', '');
        task_formatted = task_formatted.replace('</strike>', '');
        nested_data['task'] = task_formatted;
        nested_data['completed'] = table.rows[i].childNodes[0].firstElementChild.firstElementChild.checked;
        items.push(nested_data);
    }

    fs.writeFileSync(filename, JSON.stringify(json_data));
}
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

function createCheckbox(check) {
    const span = document.createElement('span');
    span.className = 'checkbox-custom';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.appendChild(checkbox);
    label.appendChild(span);
    check.appendChild(label);
    checkbox.id = index_count;
    index_count += 1;

    return checkbox;
}

function processChange(task, title, checkbox) {
    title.innerHTML = (checkbox.checked) ? task.strike() : task;
}

// Print Data

function printData(data, table) {

    table.innerHTML = "";

    for (i in data.items) {
        let row = table.insertRow(i);
        let check = row.insertCell(0);
        let title = row.insertCell(1);

        const task = data.items[i].task;
        title.innerHTML = task;

        const checkbox = createCheckbox(check);

        if (data.items[i].completed) {
            checkbox.checked = true;
            title.innerHTML = data.items[i].task.strike();
        }

        checkbox.addEventListener("change", () => processChange(task, title, checkbox));
    }
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
    var keyCode = e.code; // User press enter
    if (keyCode === "Enter") {
        var note = document.getElementById("input-note-field").value;
        if (!(note === "" || /^ *$/.test(note))) {
            var table = document.getElementById('todo_table');
            let row = table.insertRow(index_count);
            let check = row.insertCell(0);
            let title = row.insertCell(1);

            const task = note;
            title.innerHTML = task;

            const checkbox = createCheckbox(check);

            checkbox.addEventListener("change", () => processChange(task, title, checkbox));

        }
        document.getElementById("input-note-field").value = ""; // Delete values from input field
    }
};

// Main

window.onload = function () {
    date_string = getDateElement();
    handleWindowControls();
    // loadAndDisplayTodo()
    // data = getData();
    const table = document.getElementById("todo_table");
    $.getJSON(filename, (data) => printData(data, table));
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