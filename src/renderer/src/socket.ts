import { io, Socket } from "socket.io-client";

const URL =
  `${import.meta.env.VITE_VC_BASE_URL}/video-calling` ||
  "http://localhost:3000/video-calling";

const socketToken = import.meta.env.VITE_VC_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZGV2ZWxvcGVyIiwiZ2VuZXJhdGVkIjoiMjAyNS0wOC0yMVQxMTo0NjozMy41NDBaIiwidGltZXN0YW1wIjoxNzU1Nzc2NzkzNTQwLCJpYXQiOjE3NTU3NzY3OTMsImV4cCI6MTc4NzMxMjc5M30.ryYJdQysqHDBnDrFjBABz6vNYhHuipcD8zDkDng-U9I"

export const createSocket = (): Socket => {
  return io(URL, {
    auth: {token: socketToken},
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: false, // REQUIRED for manual retry
  });
};
