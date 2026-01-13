import { BrowserWindow } from "electron"
import { join } from "path"

let updaterWindow: BrowserWindow | null = null

export function createUpdaterWindow() {
  updaterWindow = new BrowserWindow({
    width: 420,
    height: 220,
    resizable: false,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    modal: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
  })

  updaterWindow.loadFile(join(__dirname, "../renderer/updater.html"))

  updaterWindow.once("ready-to-show", () => {
    updaterWindow?.show()
  })

  updaterWindow.on("closed", () => {
    updaterWindow = null
  })

  return updaterWindow
}
