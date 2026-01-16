import { autoUpdater } from "electron-updater"
import log from "electron-log"
import { sendStatus, sendProgress } from "./updater"
import { app } from "electron"

autoUpdater.logger = log
log.transports.file.level = "info"

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false


// console.log("isPackaged:", app.isPackaged)


let updateIsMandatory = false // 🔥 CORE FLAG

export function initAutoUpdater({
  onReadyToLaunch,
}: {
  onReadyToLaunch: () => void
}) {


  if (!app.isPackaged) {
    sendStatus("Dev mode – skipping updates")
    setTimeout(onReadyToLaunch, 500)
    return
  }

  autoUpdater.on("checking-for-update", () => {
    sendStatus("Checking for updates…")
  })

  autoUpdater.on("update-available", () => {
    // 🔥 MANDATORY UPDATE TRIGGER
    updateIsMandatory = true
    sendStatus("Import update found. Downloading…<br/>Please don't close this window.")
  })

  autoUpdater.on("update-not-available", () => {
    sendStatus("App is up to date.")
    setTimeout(onReadyToLaunch, 600)
  })

  autoUpdater.on("download-progress", (p) => {
    sendProgress(Math.round(p.percent))
  })

  autoUpdater.on("update-downloaded", () => {
    sendStatus("Installing Import updates…Please don't close this window.")
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 1200)
  })

  autoUpdater.on("error", (err) => {
    log.error(err)

    if (updateIsMandatory) {
      // 🔥 ENFORCEMENT: app must NOT open
      sendStatus("Update required. App will close.")
      setTimeout(() => app.quit(), 2000)
    } else {
      sendStatus("Update failed. Launching app…")
      setTimeout(onReadyToLaunch, 1200)
    }
  })

  autoUpdater.checkForUpdates()
}
