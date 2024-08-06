const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const getConversation = require("../helpers/getConversation");
const getGroupConversations = require("../helpers/getGroupConversation");

const {
  handleGroupMessagePage,
  handleGroupNewMessage,
  handleGroupSeen,
} = require("./groupConversation");
const {
  handleMessagePage,
  handleIndividualNewMessage,
  handleOneToOneSeen,
} = require("./normalConversation");

// const { log } = require("console");

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/***
 * socket running at http://localhost:8080/
 */
//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);

  //if user is undefined disconnect the socket
  if (!user || !user._id) {
    console.error("Invalid user details, disconnecting socket:", socket.id);
    socket.emit("error", {
      message: "Authentication failed. Please log in again.",
    });
    socket.disconnect();
    return;
  }

  //create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", (userId) =>
    handleMessagePage(io, socket, user, userId, onlineUser)
  );
  socket.on("group-message-page", (groupId) =>
    handleGroupMessagePage(io, socket, user, groupId)
  );
  socket.on("new message", (data) => {
    handleIndividualNewMessage(io, socket, user, data);
  });

  socket.on("group new message", (data) => {
    handleGroupNewMessage(io, socket, user, data);
  });

  socket.on("sidebar", async (currentUserId) => {
    if (!currentUserId) {
      console.error("currentUserId is undefined");
      socket.emit("error", { message: "Current user ID is missing." });
      return;
    }
    try {
      const individualConversations = await getConversation(currentUserId);
      const groupConversations = await getGroupConversations(currentUserId);

      const conversations = {
        individual: individualConversations,
        groups: groupConversations,
      };

      socket.emit("conversation", conversations);
    } catch (error) {
      console.error("Error handling new sidebar event:", error);
    }
  });

  socket.on("seen", (msgByUserId, isGroup = false) => {
    if (isGroup) {
      handleGroupSeen(socket, user, msgByUserId, io);
    } else {
      handleOneToOneSeen(socket, user, msgByUserId, io);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    onlineUser.delete(user?._id?.toString());
    io.emit("onlineUser", Array.from(onlineUser));
  });
});

module.exports = {
  app,
  server,
};
