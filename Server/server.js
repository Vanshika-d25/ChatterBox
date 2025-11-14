// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { Server } = require("socket.io");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ----------------------------------------
// 📧 EMAIL SETUP (NODEMAILER + GMAIL)
// ----------------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // Your 16-digit App Password
  },
});

// API route: Send Room ID via Email
app.post("/send-email", async (req, res) => {
  const { to, room, username } = req.body;

  if (!to || !room || !username) {
    return res.json({ status: "error", message: "Missing fields" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "ChatterHands - Room Invitation",
    html: `
      <h2>Hello 👋</h2>
      <p><strong>${username}</strong> has invited you to join a ChatterHands chat room.</p>
      <p><b>Room ID:</b> ${room}</p>
      <p>Open your ChatterHands app and enter this Room ID to join.</p>
      <br>
      <p>Regards,<br>ChatterHands Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Email error:", error);
    return res.json({ status: "error", error });
  }
});

// ----------------------------------------
//  🔗 WEBSOCKET CHAT SERVER (UNCHANGED)
// ----------------------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// When user connects
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Send message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// ----------------------------------------
//  START SERVER
// ----------------------------------------
const PORT = 6001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
