const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");

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

const UserModel = require("../models/UserModel");
const { handleCallUser } = require("./voiceCallConversation");
const CallModel = require("../models/CallModal");

const app = express();

/***socket connection */
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [process.env.FRONTEND_URL, process.env.MOBILE_URL],
//     credentials: true,
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/***
 * socket running at http://localhost:8080/
 */
//online user
const onlineUser = new Set();
// const userSocketMap = new Map();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;

  // console.log("token : ", token);

  //current user details
  const user = await getUserDetailsFromToken(token);

  // console.log("user : ", user);

  //if user is undefined disconnect the socket
  if (!user || !user._id) {
    console.error("Invalid user details, disconnecting socket:", socket.id);
    socket.emit("error", {
      message: "Authentication failed. Please log in again.",
    });
    // socket.disconnect();
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

  socket.on("get-call-history", async () => {
    const callHistory = await CallModel.find({
      $or: [{ caller: user._id }, { receiver: user._id }],
    }).populate("caller receiver");
    socket.emit("call-history", callHistory);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    onlineUser.delete(user?._id?.toString());
    socket.broadcast.emit("callEnded");
    io.emit("onlineUser", Array.from(onlineUser));
  });

  socket.emit("me", socket.id);

  // Handle user accepting the call
  socket.on("accept-call", ({ to }) => {
    try {
      io.to(to).emit("callAccepted", { socketId: socket.id });
    } catch (e) {
      console.log("error in accepting the call : ", e);
    }
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    try {
      console.log("Calling the user : ", userToCall);
      io.to(userToCall).emit("incomingCall", {
        signal: signalData,
        from,
        name,
      });
    } catch (e) {
      console.log("error in Calling the User : ", e);
    }
  });

  socket.on("answerCall", (data) => {
    try {
      io.to(data.to).emit("callAccepted", data.signal);
    } catch (e) {
      console.log("error in answerCall the call : ", e);
    }
  });

  // Handle rejecting the call
  socket.on("rejectCall", ({ receiverId }) => {
    console.log("Call rejected", receiverId);
    try {
      io.to(receiverId).emit("callRejected", {
        receiverId: receiverId,
        message: "Call rejected by user.",
      });
    } catch (e) {
      console.log("error in rejecting the call : ", e);
    }
  });

  // Handle ending the call
  socket.on("endCall", ({ id }) => {
    try {
      console.log("Call Ended from : ", id);
      io.to(id).emit("callEnded", { message: "Call has been ended." });
    } catch (e) {
      console.log("error in Ending the call : ", e);
    }
  });
});

module.exports = {
  app,
  server,
};
