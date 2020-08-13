const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
// require("electron-reload")(__dirname);
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 350,
        height: 700,
        minWidth: 250,
        minHeight: 520,
        maxWidth: 500,
        maxHeight: 900,
        frame: false,
        transparent: true,
        fullscreen: false,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
        },
    });
    win.setMenu(null);
    win.webContents.openDevTools({mode:'undocked'});
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        })
    );
    // calendarWin = new BrowserWindow({
    //     width: 400,
    //     height: 50,
    // })
}

app.on("ready", createWindow);