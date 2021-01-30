const customTitlebar = require('custom-electron-titlebar')
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const titlebar = new customTitlebar.Titlebar()

  ipcRenderer.on('change-color', (evt, color) => {
    titlebar.updateBackground(customTitlebar.Color.fromHex(color))
  })

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
