const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bluetoothPicker', {
  onUpdate(callback) {
    const listener = (_event, data) => callback(data)
    ipcRenderer.on('bluetooth-picker:update', listener)
    return () => ipcRenderer.removeListener('bluetooth-picker:update', listener)
  },
  select(deviceId) {
    ipcRenderer.send('bluetooth-picker:select', deviceId)
  },
  cancel() {
    ipcRenderer.send('bluetooth-picker:cancel')
  }
})
