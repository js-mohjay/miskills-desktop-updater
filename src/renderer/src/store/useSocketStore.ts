import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Socket } from "socket.io-client";
import { createSocket } from "@/socket";

/* -------------------- TYPES -------------------- */

export type SocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "retrying"
  | "disconnected"
  | "error";

interface SocketStoreState {
  socket: Socket | null;

  status: SocketStatus;
  error: string | null;
  retryCount: number;

  connectSocket: (manual?: boolean) => void;
  disconnectSocket: () => void;
}

/* -------------------- CONSTANTS -------------------- */

const SOCKET_CONNECT_TIMEOUT_MS = 10_000;
const SOCKET_MAX_AUTO_RETRIES = 5;

const nextBackoffMs = (retry: number) =>
  Math.min(1000 * 2 ** retry, 15_000);

/* -------------------- STORE -------------------- */

export const useSocketStore = create<SocketStoreState>()(
  devtools((set, get) => ({
    socket: null,
    status: "idle",
    error: null,
    retryCount: 0,

    /* ---------- CONNECT ---------- */
    connectSocket: (manual = false) => {
      const { socket } = get();

      // Prevent duplicate connections
      if (socket?.connected || get().status === "connecting") return;

      if (manual) {
        set({ retryCount: 0 });
      }

      set({
        status: "connecting",
        error: null,
      });

      const s = createSocket();
      let connectTimeoutId: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        if (connectTimeoutId) clearTimeout(connectTimeoutId);
        s.removeAllListeners();
      };

      const scheduleRetry = (reason?: Error) => {
        cleanup();
        s.close();
        const { retryCount } = get();

        if (!manual && retryCount < SOCKET_MAX_AUTO_RETRIES) {
          const delay = nextBackoffMs(retryCount);

          set({
            status: "retrying",
            error: reason?.message || "Reconnecting…",
          });

          setTimeout(() => {
            set({ retryCount: retryCount + 1 });
            get().connectSocket(false);
          }, delay);
        } else {
          set({
            status: "error",
            error: reason?.message || "Unable to connect to server",
          });
        }
      };

      /* ---------- TIMEOUT GUARD ---------- */
      connectTimeoutId = setTimeout(() => {
        scheduleRetry(new Error("Connection timed out"));
      }, SOCKET_CONNECT_TIMEOUT_MS + 200);

      /* ---------- SOCKET EVENTS ---------- */

      s.on("connect", () => {
        if (connectTimeoutId) clearTimeout(connectTimeoutId);

        set({
          socket: s,
          status: "connected",
          error: null,
          retryCount: 0,
        });
      });

      s.on("connect_error", (err) => {
        scheduleRetry(err);
      });

      s.on("disconnect", (reason) => {
        // intentional disconnect → do not retry
        if (reason === "io client disconnect") {
          cleanup();
          set({
            socket: null,
            status: "disconnected",
          });
          return;
        }

        scheduleRetry(new Error(reason));
      });

      // keep reference so we can close it later
      set({ socket: s });
    },

    /* ---------- DISCONNECT ---------- */
    disconnectSocket: () => {
      const { socket } = get();
      socket?.close();
      set({
        socket: null,
        status: "disconnected",
        error: null,
      });
    },
  }))
);
