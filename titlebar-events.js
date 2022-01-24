/**
 * The titlebar events are defined in this file for the sake of simplicity.
 */
const { BrowserWindow, Menu, ipcMain } = require('electron')

function parseMenu() {
  const menu = new WeakSet();
  return (key, value) => {
    if (key === 'commandsMap') return;
    if (typeof value === 'object' && value !== null) {
      if (menu.has(value)) return;
      menu.add(value)
    }
    return value
  }
}

function getMenuItemByCommandId(commandId, menu) {
  let menuItem;
  menu.items.forEach(item => {
    if (item.submenu) {
      const submenuItem = getMenuItemByCommandId(commandId, item.submenu);
      if (submenuItem) menuItem = submenuItem;
    }
    if (item.commandId === commandId) menuItem = item;
  });

  return menuItem;
}

// Request default menu and send to renderer title bar process
ipcMain.on('request-application-menu', (event) => {
  const menu = Menu.getApplicationMenu();
  const jsonMenu = JSON.parse(JSON.stringify(menu, parseMenu()));
  event.sender.send('renderer-titlebar', jsonMenu);
})

ipcMain.on('window-event', (event, eventName) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  switch (eventName) {
    case 'window-minimize':
      window.minimize()
      break
    case 'window-maximize':
      window.isMaximized() ? window.unmaximize() : window.maximize()
      break
    case 'window-close':
      window.close();
      break
    case 'window-is-maximized':
      event.returnValue = window.isMaximized()
      break
    default:
      break
  }
})

ipcMain.on('menu-event', (event, commandId) => {
  const menu = Menu.getApplicationMenu();
  const item = getMenuItemByCommandId(commandId, menu);
  item?.click(undefined, BrowserWindow.fromWebContents(event.sender), event.sender);
})