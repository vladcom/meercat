import io, { Socket } from 'socket.io-client';

let socket: Socket;
function getSocket() {
  if (!socket) {
    socket = io('/', {
      path: '/socket',
      withCredentials: true,
    });
  }
  return socket;
}

export function getIncidentSocket() {
  return getSocket();
}
