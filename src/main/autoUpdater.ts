import { autoUpdater } from "electron-updater"
import { BrowserWindow, app } from "electron"
import log from "electron-log"

autoUpdater.logger = log
log.transports.file.level = "info"
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

export function initAutoUpdater(mainWindow: BrowserWindow) {
  autoUpdater.on("checking-for-update", () => {
    mainWindow.webContents.send("update:status", "Checking for updates...")
  })

  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update:status", "Update available. Downloading...")
  })

  autoUpdater.on("update-not-available", () => {
    mainWindow.webContents.send("update:status", "App is up to date.")
  })

  autoUpdater.on("download-progress", (progress) => {
    mainWindow.webContents.send("update:progress", Math.round(progress.percent))
  })

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update:status", "Update ready. Restarting...")
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 1500)
  })

  autoUpdater.on("error", (err) => {
    mainWindow.webContents.send("update:error", err.message)
  })

  // 🔥 Mandatory: check every app start
  autoUpdater.checkForUpdates()
}
