const { app, BrowserWindow, ipcMain, nativeImage } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

let mainWindow

const { safeStorage } = require('electron')

function intervalsPaths() {
  const dir = app.getPath('userData')
  return {
    credentials: path.join(dir, 'intervals-credentials.json'),
    cache: path.join(dir, 'intervals-plan-cache.json')
  }
}

async function readIntervalsCredentials() {
  const file = intervalsPaths().credentials
  try {
    const saved = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    if (!saved || !saved.encryptedKey || !safeStorage.isEncryptionAvailable()) return null
    return { apiKey: safeStorage.decryptString(Buffer.from(saved.encryptedKey, 'base64')) }
  } catch {
    return null
  }
}

async function readIntervalsCache() {
  try {
    const data = JSON.parse(await fs.promises.readFile(intervalsPaths().cache, 'utf8'))
    if (!data || !Array.isArray(data.events)) return null
    return data
  } catch {
    return null
  }
}

async function writeIntervalsCache(data) {
  const file = intervalsPaths().cache
  const temp = file + '.tmp'
  await fs.promises.writeFile(temp, JSON.stringify(data), { mode: 0o600 })
  await fs.promises.rename(temp, file)
}

function checkMainSender(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    throw new Error('Ugyldig forespørsel til Intervals.icu')
  }
}

ipcMain.handle('intervals:status', async event => {
  checkMainSender(event)
  const credentials = await readIntervalsCredentials()
  const cache = await readIntervalsCache()
  return {
    connected: !!credentials,
    cachedAt: cache?.cachedAt || null,
    events: cache?.events || []
  }
})

ipcMain.handle('intervals:save-credentials', async (event, input) => {
  checkMainSender(event)
  const apiKey = String(input?.apiKey || '').trim()
  if (apiKey.length < 12 || apiKey.length > 300) throw new Error('API-nøkkelen ser ikke gyldig ut')
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('macOS sikker nøkkellagring er ikke tilgjengelig. Nøkkelen ble ikke lagret.')
  }
  const encryptedKey = safeStorage.encryptString(apiKey).toString('base64')
  const file = intervalsPaths().credentials
  const temp = file + '.tmp'
  await fs.promises.writeFile(temp, JSON.stringify({ encryptedKey }), { mode: 0o600 })
  await fs.promises.rename(temp, file)
  return { connected: true }
})

ipcMain.handle('intervals:sync', async event => {
  checkMainSender(event)
  const credentials = await readIntervalsCredentials()
  const cache = await readIntervalsCache()
  if (!credentials) return { ok: false, connected: false, cachedAt: cache?.cachedAt || null, events: cache?.events || [], message: 'Intervals.icu er ikke tilkoblet' }

  const now = new Date()
  const oldest = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo' }).format(now)
  const future = new Date(now.getTime() + 7 * 86400000)
  const newest = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo' }).format(future)
  const query = new URLSearchParams({ oldest, newest, category: 'WORKOUT', resolve: 'true' })
  const auth = Buffer.from('API_KEY:' + credentials.apiKey, 'utf8').toString('base64')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch('https://intervals.icu/api/v1/athlete/0/events?' + query.toString(), {
      method: 'GET',
      headers: { Authorization: 'Basic ' + auth, Accept: 'application/json' },
      signal: controller.signal
    })
    if (!response.ok) throw new Error('Intervals.icu svarte med HTTP ' + response.status)
    const payload = await response.json()
    if (!Array.isArray(payload)) throw new Error('Intervals.icu returnerte et ugyldig kalenderformat')
    const events = payload.filter(item =>
      item && item.id != null &&
      String(item.category || '').toUpperCase() === 'WORKOUT' &&
      typeof item.name === 'string' &&
      typeof item.start_date_local === 'string'
    )
    const result = { cachedAt: new Date().toISOString(), oldest, newest, events }
    await writeIntervalsCache(result)
    return { ok: true, connected: true, ...result, message: events.length + ' planlagte økter synkronisert' }
  } catch (error) {
    return {
      ok: false,
      connected: true,
      cachedAt: cache?.cachedAt || null,
      events: cache?.events || [],
      message: error.name === 'AbortError' ? 'Tidsavbrudd mot Intervals.icu. Bruker lokal kopi.' : (error.message || 'Synkronisering feilet') + '. Bruker lokal kopi.'
    }
  } finally {
    clearTimeout(timeout)
  }
})

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

ipcMain.handle('workouts:load', async event => {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    throw new Error('Ugyldig forespørsel om øktbiblioteket')
  }
  const workoutsPath = path.join(app.getAppPath(), 'workouts.json')
  const contents = await fs.promises.readFile(workoutsPath, 'utf8')
  return JSON.parse(contents)
})

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
      sandbox: true,
      backgroundThrottling: false
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
