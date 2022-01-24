const { ipcRenderer } = require('electron')
const customTitlebar = require('custom-electron-titlebar')


function renderVersions() {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
}

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('request-application-menu')
  renderVersions()
})

ipcRenderer.on('renderer-titlebar', (event, menu) => {
  new customTitlebar.Titlebar({
    backgroundColor: cet.Color.fromHex("#388e3c"),
    menu,
    onMinimize:  () => ipcRenderer.send('window-event', 'window-minimize'),
    onMaximize:  () => ipcRenderer.send('window-event', 'window-maximize'),
    onClose:     () => ipcRenderer.send('window-event', 'window-close'),
    isMaximized: () => ipcRenderer.sendSync('window-event', 'window-is-maximized'),
    onMenuItemClick: commandId => ipcRenderer.send('menu-event', commandId)
  })
})

ipcRenderer.on('window-fullscreen', (event, isFullScreen) => {
  titlebar.onWindowFullScreen(isFullScreen)
})

ipcRenderer.on('window-focus', (event, isFocused) => {
  if (titlebar) titlebar.onWindowFocus(isFocused)
})