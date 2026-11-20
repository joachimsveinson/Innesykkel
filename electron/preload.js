const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApp', {
  isElectron: true,
  platform: process.platform,
  loadWorkouts: () => ipcRenderer.invoke('workouts:load')
})
