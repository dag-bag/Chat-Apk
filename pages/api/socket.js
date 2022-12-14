/** @format */

import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      cors: {
        origin: "https://chat-apk.vercel.app/",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      // socket.broadcast.emit("a user connected");
      socket.on("setup", (id) => {
        socket.join(id);
      });

      socket.on("join chat", (chatId) => {
        socket.join(chatId);
        socket.emit("connected");
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new msg", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
      socket.off("setup", (userid) => {
        console.log("User Disconnected");
        socket.leave(userid);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
