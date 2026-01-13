import { BrowserWindow } from "electron"
import { join } from "path"
import { is } from "@electron-toolkit/utils" // 🔥 NEW: detect dev/prod

let updaterWindow: BrowserWindow | null = null

// ================================
// CREATE WINDOW
// ================================
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

  // 🔥 FIX: load updater differently in DEV vs PROD
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    // DEV → load from Vite dev server
    updaterWindow.loadURL(
      `${process.env.ELECTRON_RENDERER_URL}/updater.html`
    )
  } else {
    // PROD → load bundled html
    updaterWindow.loadFile(join(__dirname, "../renderer/updater.html"))
  }

  updaterWindow.once("ready-to-show", () => {
    updaterWindow?.show()
  })

  updaterWindow.on("closed", () => {
    updaterWindow = null
  })

  return updaterWindow
}

// ================================
// STORE REFERENCE
// ================================
export function setUpdaterWindow(win: BrowserWindow) {
  updaterWindow = win
}

// ================================
// SEND EVENTS
// ================================
export function sendStatus(msg: string) {
  updaterWindow?.webContents.send("update:status", msg)
}

export function sendProgress(progress: number) {
  updaterWindow?.webContents.send("update:progress", progress)
}
