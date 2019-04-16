const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const exec = require('child_process').exec

let mainWindow
let token = undefined

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 })
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

electron.ipcMain.on('token', (event, arg) => {
  token = arg
  event.returnValye = arg
})

async function runWorker() {
  if (token && token.length > 0) {
    console.log("consume work")
    const process = new Promise((resolve, reject) => {
        console.log(`ugjob consume --trace -t "${token}"`)
        exec(`ugjob consume --trace -t "${token}"`, (err, stderr) => {
          console.log(stderr)
          if (err) reject(err)
          else resolve(stderr)
        })
      }
    )
    const maxTime = new Promise(resv => setTimeout(resv, 60 * 1000 * 5)) // maximum 5 minute
    await Promise.race([process, maxTime])
    return true
  }
  return false
}

async function startWorker() {
  while (true) {
    try {
      await runWorker()
    } catch (err) {
      console.error(err)
    }
    await new Promise(resv => setTimeout(resv, 5000))
  }
}

startWorker()