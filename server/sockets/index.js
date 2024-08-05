const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
// const UserModel = require("../models/UserModel");
// const { ConversationModel, MessageModel } = require("../models/ConversationModel");
// const { GroupMessageModel, GroupConversationModel } = require("../models/GroupConversationModel");
// const getConversation = require("../helpers/getConversation");
// const getGroupConversations = require("../helpers/getGroupConversation");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const normalChat = require('./normalChat');
const groupChat = require('./groupChat');

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token);

  console.log("token : ", token);
  console.log("user :", user);

  if (!user || !user._id) {
    console.error("Invalid user details, disconnecting socket:", socket.id);
    socket.emit("error", {
      message: "Authentication failed. Please log in again.",
    });
    socket.disconnect();
    return;
  }

  socket.join(user?._id.toString());
  io.emit("onlineUser", Array.from(io.sockets.adapter.sids.keys()));

  // Delegate to the appropriate handler
  normalChat(io, socket, user);
  groupChat(io, socket, user);
});

module.exports = {
  app,
  io,
  server
};
