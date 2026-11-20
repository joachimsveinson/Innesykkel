const { app, BrowserWindow, ipcMain, nativeImage } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

let mainWindow
let activeBluetoothRequest = null

function finishBluetoothRequest(request, deviceId = '') {
  if (!request || activeBluetoothRequest !== request) return
  activeBluetoothRequest = null
  try {
    request.callback(deviceId)
  } catch (error) {
    console.error('Could not finish Bluetooth selection', error)
  }
  if (request.picker && !request.picker.isDestroyed()) {
    request.picker.close()
  }
}

function updateBluetoothPicker(request, devices) {
  request.devices = (devices || []).filter(device => device.deviceId)
  if (request.picker && !request.picker.isDestroyed() && request.picker.webContents.isLoading() === false) {
    request.picker.webContents.send('bluetooth-picker:update', {
      devices: request.devices.map((device, index) => ({
        id: device.deviceId,
        name: device.deviceName || 'Bluetooth-enhet uten navn',
        index: index + 1
      }))
    })
  }
}

function installBluetoothDevicePicker(win) {
  win.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    event.preventDefault()

    let request = activeBluetoothRequest
    if (!request) {
      const picker = new BrowserWindow({
        width: 440,
        height: 520,
        minWidth: 360,
        minHeight: 360,
        title: 'Velg Bluetooth-enhet',
        parent: win,
        modal: true,
        resizable: true,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, 'picker-preload.js'),
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: true
        }
      })

      request = { callback, devices: [], picker }
      activeBluetoothRequest = request

      picker.on('closed', () => {
        if (activeBluetoothRequest === request) {
          finishBluetoothRequest(request, '')
        }
      })

      picker.loadFile(path.join(__dirname, 'bluetooth-picker.html')).then(() => {
        if (activeBluetoothRequest === request && !picker.isDestroyed()) {
          picker.webContents.send('bluetooth-picker:update', {
            devices: request.devices.map((device, index) => ({
              id: device.deviceId,
              name: device.deviceName || 'Bluetooth-enhet uten navn',
              index: index + 1
            }))
          })
        }
      }).catch(error => {
        console.error('Could not open Bluetooth picker', error)
        finishBluetoothRequest(request, '')
      })
    } else {
      // Electron can emit this event more than once during the same scan.
      // Keep the latest callback and refresh the available device list.
      request.callback = callback
    }

    updateBluetoothPicker(request, devices)
  })
}

ipcMain.on('bluetooth-picker:select', (event, deviceId) => {
  const request = activeBluetoothRequest
  if (!request || !request.picker || event.sender !== request.picker.webContents) return
  const selected = request.devices.find(device => device.deviceId === deviceId)
  if (selected) finishBluetoothRequest(request, selected.deviceId)
})

ipcMain.on('bluetooth-picker:cancel', event => {
  const request = activeBluetoothRequest
  if (!request || !request.picker || event.sender !== request.picker.webContents) return
  finishBluetoothRequest(request, '')
})

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

  if (process.platform === 'darwin') {
    const iconPath = path.join(__dirname, '..', 'assets', 'innesykkel.icns')
    if (fs.existsSync(iconPath)) {
      app.dock.setIcon(nativeImage.createFromPath(iconPath))
    }
  }

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
