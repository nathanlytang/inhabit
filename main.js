const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
//    win = new BrowserWindow({width: 400, height: 800, })
   win = new BrowserWindow({width: 300, height: 600, frame: false})
//    win.setMenuBarVisibility(false)
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))
}

app.on('ready', createWindow)