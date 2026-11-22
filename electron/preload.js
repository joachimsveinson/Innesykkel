const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApp', {
  isElectron: true,
  platform: process.platform,
  loadWorkouts: () => ipcRenderer.invoke('workouts:load'),
  intervalsStatus: () => ipcRenderer.invoke('intervals:status'),
  intervalsSaveCredentials: input => ipcRenderer.invoke('intervals:save-credentials', input),
  intervalsSync: () => ipcRenderer.invoke('intervals:sync')
})
