// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const { performance } = require('perf_hooks')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // change to true to compare to normal electron close time.
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: false,
    }
  })

  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  let t0, t1

  mainWindow.on('closed', () => {
    mainWindow = null
    t1 = performance.now()
    console.log(t1 - t0)
  })

  mainWindow.on('close', () => {
    t0 = performance.now()
    // Destroy the window for short close time:
    // mainWindow.destroy()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
