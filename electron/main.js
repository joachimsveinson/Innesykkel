const { app, BrowserWindow, dialog } = require('electron')
const path = require('node:path')

let mainWindow
let bluetoothDialogOpen = false

function installBluetoothDevicePicker(win) {
  win.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    event.preventDefault()

    if (bluetoothDialogOpen) {
      callback('')
      return
    }

    const available = devices.filter(device => device.deviceId)
    if (available.length === 0) {
      callback('')
      return
    }

    bluetoothDialogOpen = true

    const labels = available.map((device, index) => {
      const name = device.deviceName || 'Bluetooth-enhet uten navn'
      return `${name} (${index + 1})`
    })

    dialog.showMessageBox(win, {
      type: 'question',
      title: 'Velg Bluetooth-enhet',
      message: 'Velg enheten du vil koble til.',
      detail: 'Kontroller at du velger riktig sykkelrulle eller sensor.',
      buttons: [...labels, 'Avbryt'],
      cancelId: labels.length,
      defaultId: 0,
      noLink: true
    }).then(({ response }) => {
      if (response >= 0 && response < available.length) {
        callback(available[response].deviceId)
      } else {
        callback('')
      }
    }).catch(() => {
      callback('')
    }).finally(() => {
      bluetoothDialogOpen = false
    })
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 650,
    title: 'Innesykkel',
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  installBluetoothDevicePicker(mainWindow)
  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  app.setName('Innesykkel')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
