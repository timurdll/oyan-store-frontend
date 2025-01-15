import { io, Socket } from "socket.io-client";

const socket: Socket = io(`${import.meta.env.VITE_API_URL}`, {
  autoConnect: false, // Автоматическое подключение отключено
  withCredentials: true, // Для работы с CORS
});

export default socket;
