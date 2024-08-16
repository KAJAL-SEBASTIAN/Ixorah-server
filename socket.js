const socketIo = require('socket.io');
 
let io;
 
function init(server) {
  io = socketIo(server, {
    cors: {
      origin: ['https://ixorah.com', "https://www.ixorah.com", "http://localhost:3000"],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  });
 
  io.on('connection', (socket) => {
    console.log('New client connected');
 
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
 
    socket.on('leaveRoom', (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left room`);
    });
 
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
 
  return io;
}
 
function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
 
module.exports = { init, getIo };
 