import { io } from 'socket.io-client';
// import socketServer from '../proxy';
const socketServer = "127.0.0.1:5000"

export const socket = io(socketServer);