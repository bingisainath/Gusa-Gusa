const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const {
  GroupMessage,
  GroupConversationModel,
} = require("../models/GroupConversationModel");
const getConversation = require("../helpers/getConversation");
const getGroupConversations = require("../helpers/getGroupConversation");

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

  console.log("token : ", token);
  console.log("user :", user);

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

  socket.on("message-page", async (userId) => {
    if (!userId) {
      console.error("Invalid userId provided for message-page event");
      socket.emit("error", { message: "User ID is missing." });
      return;
    }

    try {
      console.log("userId", userId);
      const userDetails = await UserModel.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit("message-user", payload);

      //get previous message
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error fetching message-page data:", error);
    }
  });

  socket.on("new message", async (data) => {
    if (!data || (!data.sender && !data.groupId)) {
      console.error("Invalid data provided for new message event");
      socket.emit("error", { message: "Message data is incomplete." });
      return;
    }

    try {
      let conversation;

      console.log("new message Data :", data);

      if (data.groupId) {
        console.log("data belongs to group :", data.groupId);

        conversation = await GroupConversationModel.findById(data.groupId);
        if (!conversation) {
          conversation = new GroupConversationModel({ group: data.groupId });
          await conversation.save();
        }

        const message = new GroupMessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
          groupId: data.groupId,
        });
        const saveMessage = await message.save();

        const updateConversation = await GroupConversationModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: saveMessage._id } }
        );

        const getConversationMessage = await GroupConversationModel.findById(
          data.groupId
        )
          .populate("messages")
          .sort({ updatedAt: -1 });

        const groupParticipants = conversation.participants.map((p) =>
          p.toString()
        );
        groupParticipants.forEach((participantId) => {
          io.to(participantId).emit(
            "message",
            getConversationMessage?.messages || []
          );
        });
      } else {
        console.log("data belongs to group :", data.groupId);
        conversation = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender },
          ],
        });
        if (!conversation) {
          conversation = new ConversationModel({
            sender: data.sender,
            receiver: data.receiver,
          });
          await conversation.save();
        }

        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
        });
        const saveMessage = await message.save();

        const updateConversation = await ConversationModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: saveMessage._id } }
        );

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        io.to(data.sender).emit(
          "message",
          getConversationMessage?.messages || []
        );
        io.to(data.receiver).emit(
          "message",
          getConversationMessage?.messages || []
        );
      }

      const conversationSender = await getConversation(data.sender);
      const conversationReceiver = data.groupId
        ? await getGroupConversations(data.receiver)
        : await getConversation(data.receiver);

      io.to(data.sender).emit("conversation", conversationSender);
      io.to(data.receiver).emit("conversation", conversationReceiver);
      if (data.groupId) {
        const groupConversations = await getGroupConversations(data.sender);
        io.to(data.groupId).emit("conversation", groupConversations);
      }
    } catch (error) {
      console.error("Error handling new message event:", error);
    }
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    if (!currentUserId) {
      console.error("currentUserId is undefined");
      socket.emit("error", { message: "Current user ID is missing." });
      return;
    }
    try {
      console.log("current user", currentUserId);

      const individualConversations = await getConversation(currentUserId);
      const groupConversations = await getGroupConversations(currentUserId);

      const conversations = {
        individual: individualConversations,
        groups: groupConversations,
      };

      socket.emit("conversation", conversations);
    } catch (e) {
      console.error("Error handling new sidebar event:", error);
    }
  });

  socket.on("seen", async (msgByUserId) => {
    try {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];

      const updateMessages = await MessageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      //send conversation
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    } catch (e) {
      console.error("Error handling new seen event:", error);
    }
  });

  //disconnect
  socket.on("disconnect", () => {
    if (user?._id) {
      onlineUser.delete(user._id.toString());
    } else {
      console.log("Error in disconnect user");
    }
    // onlineUser.delete(user?._id?.toString());
    console.log("disconnect user ", socket.id);
  });
});

module.exports = {
  app,
  server,
};
