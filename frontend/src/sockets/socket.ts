import { io } from "socket.io-client";

const socket = io((import.meta as any).env.VITE_API_URL);

export default socket;
