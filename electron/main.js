const { app, BrowserWindow, dialog } = require('electron')
const path = require('node:path')

let mainWindow
let bluetoothDialogOpen = false

function installBluetoothDevicePicker(win) {
  win.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    event.preventDefault()

    // Electron can emit this event with an empty list while it is still
    // scanning. Do not cancel the request. Wait for another event.
    if (!devices || devices.length === 0) {
      return
    }

    // The same request can emit this event more than once while the
    // selection dialog is open. Do not cancel those later events.
    if (bluetoothDialogOpen) {
      return
    }

    const available = devices.filter(device => device.deviceId)
    if (available.length === 0) {
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
