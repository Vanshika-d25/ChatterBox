// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS to allow frontend communication (adjust origin if needed)
app.use(cors());

const io = new Server(server, {
  cors: {
     origin: "*", // Replace with your React app's URL
    methods: ["GET", "POST"],
  },
});


// Listen for WebSocket connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Start the server
const PORT = 6001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
