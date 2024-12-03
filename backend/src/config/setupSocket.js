const { Server } = require('socket.io');
const express = require('express');
const http = require("http");
const cors = require('cors');

const SOCKET_PORT = process.env.SOCKET_PORT || 3000; // Default port if env not set

const socketApp = express();
socketApp.use(cors());

// Http Server
const socketServer = http.createServer(socketApp);

let io;

const setupSocket = () => {
  io = require('socket.io')(socketServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (client) => {
    console.log('New client connected:', client.id);

    // Send success message to the newly connected client
    client.emit('message', 'Kết nối thành công với server');

    // Listen for 'message' events from the client
    client.on('messageqq', (data) => {
      console.log('Tin nhắn từ client:', data);
      io.emit('message', data); // Broadcast message to all clients
    });

    // Handle client disconnection
    client.on('disconnect', () => {
      console.log('Client disconnected:', client.id);

      // Update the users list after disconnect
      const users = [];
      for (const [id, socket] of io.of("/").sockets) {
        users.push({
          clientID: id,
          user: socket?.user,
        });
      }
      io.emit("users", users);
    });

  });

};

socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket server running on port ${SOCKET_PORT}`);
});

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

module.exports = setupSocket, { getIO };


