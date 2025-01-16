import { io, Socket } from "socket.io-client";

const socket: Socket = io(`${import.meta.env.VITE_WSS_URL}`, {
  autoConnect: false, // Автоматическое подключение отключено
  withCredentials: true, // Для работы с CORS
  path: "/socket.io",
  // transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected to:", import.meta.env.VITE_WSS_URL);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  console.log("Connection URL:", import.meta.env.VITE_WSS_URL);
});

export default socket;
