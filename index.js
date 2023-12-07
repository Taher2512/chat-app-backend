import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3500;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? [""] : ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  // Emit a welcome message to the newly connected user
  let timestamp = new Date().getTime();
  socket.emit("receiveMessage", {
    text: "Welcome to Chat App!",
    user: "System",
    timestamp: timestamp,
  });

  socket.on("newUser", (userName) => {
    const welcomeMessage = {
      text: `${userName} has joined the chat`,
      user: "",
    };
    socket.broadcast.emit("receiveMessage", welcomeMessage);
  });

  socket.on("newMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  // socket.on("disconnect", () => {
  //   console.log(`User disconnected: ${socket.id}`);
  // });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
