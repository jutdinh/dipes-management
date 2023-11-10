// import { io } from 'socket.io-client';
// import socketServer from '../../proxy';
// // const socketServer = "192.168.15.205:5000"

// export const socket = io(socketServer);


import { io } from 'socket.io-client';
import socketServer from '../../proxy';

export const socket = io(socketServer);