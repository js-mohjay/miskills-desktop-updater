import { contextBridge, ipcRenderer } from "electron"

// =======================================================
// APP API
// =======================================================
const api = {
  quitApp: () => ipcRenderer.invoke("app:quit"),
}

// =======================================================
// UPDATER API
// =======================================================
const updaterAPI = {
  onStatus: (cb: (msg: string) => void) =>
    ipcRenderer.on("update:status", (_, msg) => cb(msg)),

  onProgress: (cb: (p: number) => void) =>
    ipcRenderer.on("update:progress", (_, p) => cb(p)),

  onError: (cb: (e: string) => void) =>
    ipcRenderer.on("update:error", (_, e) => cb(e)),
}

// =======================================================
// SAFE EXPOSURE
// =======================================================
contextBridge.exposeInMainWorld("api", api)
contextBridge.exposeInMainWorld("updater", updaterAPI)
