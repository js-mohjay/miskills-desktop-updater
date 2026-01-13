import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// =======================================================
// CUSTOM RENDERER API (already existed)
// =======================================================
const api = {
  quitApp: () => ipcRenderer.invoke("app:quit"),
}

// =======================================================
// 🔥 UPDATED / NEW: UPDATER IPC API
// Exposed so updater.html & renderer can listen to updates
// =======================================================
const updaterAPI = {
  onStatus: (cb: (msg: string) => void) =>
    ipcRenderer.on("update:status", (_, msg) => cb(msg)),

  onProgress: (cb: (p: number) => void) =>
    ipcRenderer.on("update:progress", (_, p) => cb(p)),

  onError: (cb: (err: string) => void) =>
    ipcRenderer.on("update:error", (_, err) => cb(err)),
}

// =======================================================
// CONTEXT ISOLATION SAFE EXPORTS
// =======================================================
if (process.contextIsolated) {
  try {
    // 🔥 existing electron-toolkit API
    contextBridge.exposeInMainWorld("electron", electronAPI)

    // 🔥 existing custom app API
    contextBridge.exposeInMainWorld("api", api)

    // 🔥 UPDATED: updater communication API
    contextBridge.exposeInMainWorld("updater", updaterAPI)
  } catch (error) {
    console.error("Preload expose error:", error)
  }
} else {
  // =====================================================
  // FALLBACK (contextIsolation = false)
  // =====================================================
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
  // @ts-ignore
  window.updater = updaterAPI
}
