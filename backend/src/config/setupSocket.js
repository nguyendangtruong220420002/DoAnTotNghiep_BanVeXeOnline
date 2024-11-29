const { Server } = require('socket.io');

// Hàm cấu hình Socket.IO
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Cho phép kết nối từ bất kỳ đâu
       
    }
  });

  // Lắng nghe sự kiện kết nối từ client
  io.on('connection', (socket) => {
    console.log('Một client đã kết nối với server');

    // Gửi thông báo đến client khi kết nối thành công
    socket.emit('message', 'Kết nối thành công với server');

    // Lắng nghe sự kiện 'message' từ client
    socket.on('message', (data) => {
      console.log('Tin nhắn từ client:', data);
      io.emit('message', data); // Gửi lại tin nhắn cho tất cả client
    });

    // Lắng nghe khi client ngắt kết nối
    socket.on('disconnect', () => {
      console.log('Client đã ngắt kết nối');
    });
  });

  return io;
};

module.exports = setupSocket;