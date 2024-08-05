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
  GroupMessageModel,
  GroupConversationModel,
} = require("../models/GroupConversationModel");
const getConversation = require("../helpers/getConversation");
const getGroupConversations = require("../helpers/getGroupConversation");
const { log } = require("console");

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: process.env.FRONTEND_URL,
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

  socket.on("message-page", async (userId) => {
    if (!userId) {
      console.error("Invalid userId provided for message-page event");
      socket.emit("error", { message: "User ID is missing." });
      return;
    }

    try {
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

      socket.emit("user-message", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error fetching message-page data:", error);
    }
  });

  socket.on("group-message-page", async (groupId) => {
    if (!groupId) {
      console.error("Invalid groupId provided for group-message-page event");
      socket.emit("error", { message: "Group ID is missing." });
      return;
    }

    try {
      const groupDetails = await GroupConversationModel.findById(
        groupId
      ).populate("participants.userId", "name profile_pic");

      const payload = {
        _id: groupDetails?._id,
        name: groupDetails?.groupName,
        profile_pic: groupDetails?.groupProfilePic,
        participants: groupDetails?.participants,
      };
      socket.emit("message-group", payload);

      //get previous group messages
      const getGroupMessages = await GroupConversationModel.findById(groupId)
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("group-message", getGroupMessages?.messages || []);
    } catch (error) {
      console.error("Error fetching group-message-page data:", error);
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
      if (data.groupId) {
        conversation = await GroupConversationModel.findById(data.groupId);
        if (!conversation) {
          conversation = new GroupConversationModel({ group: data.groupId });
          await conversation.save();
        }

        // Initialize seenBy array with group participants
        const seenByArray = conversation.participants.map((participant) => ({
          userId: participant.userId,
          seen: false,
        }));

        const message = new GroupMessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
          groupId: data.groupId,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          seenBy: seenByArray,
        });
        const saveMessage = await message.save();

        await GroupConversationModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: saveMessage._id } }
        );

        const getConversationMessage = await GroupConversationModel.findById(
          data.groupId
        )
          .populate("messages")
          .sort({ updatedAt: -1 });

        const groupParticipants = conversation.participants.map((p) =>
          p.userId.toString()
        );
        groupParticipants.forEach((participantId) => {
          io.to(participantId).emit(
            "group-message",
            getConversationMessage?.messages || []
          );
        });
      } else {
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

        await ConversationModel.updateOne(
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
          "user-message",
          getConversationMessage?.messages || []
        );
        io.to(data.receiver).emit(
          "user-message",
          getConversationMessage?.messages || []
        );
      }

      const individualConversations = await getConversation(data.sender);
      const groupConversations = await getGroupConversations(data.sender);

      const conversations = {
        individual: individualConversations,
        groups: groupConversations,
      };

      io.to(data.sender).emit("conversation", conversations);

      if (!data.groupId) {
        const receiverIndividualConversations = await getConversation(
          data.receiver
        );
        const receiverGroupConversations = await getGroupConversations(
          data.receiver
        );

        const receiverConversations = {
          individual: receiverIndividualConversations,
          groups: receiverGroupConversations,
        };

        io.to(data.receiver).emit("conversation", receiverConversations);
      }
    } catch (error) {
      console.error("Error handling new message event:", error);
    }
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

  socket.on("seen", async (msgByUserId, isGroup = false) => {
    try {
      if (isGroup) {
        const groupConversation = await GroupConversationModel.findById(
          msgByUserId
        );

        if (!groupConversation) {
          console.error("Group conversation not found for ID:", msgByUserId);
          return;
        }

        const groupMessageIds = groupConversation.messages || [];

        await GroupMessageModel.updateMany(
          { _id: { $in: groupMessageIds }, "seenBy.userId": user._id },
          { $set: { "seenBy.$.seen": true } }
        );

        const userConversations = {
          individual: await getConversation(user._id.toString()),
          groups: await getGroupConversations(user._id.toString()),
        };
        const groupConversations = await getGroupConversations(msgByUserId);

        io.to(user._id.toString()).emit("conversation", userConversations);
        io.to(msgByUserId).emit("conversation", {
          individual: [],
          groups: groupConversations,
        });
      } else {
        const conversation = await ConversationModel.findOne({
          $or: [
            { sender: user._id, receiver: msgByUserId },
            { sender: msgByUserId, receiver: user._id },
          ],
        });

        const conversationMessageIds = conversation?.messages || [];

        await MessageModel.updateMany(
          { _id: { $in: conversationMessageIds }, seen: false },
          { $set: { seen: true } }
        );

        const userConversations = {
          individual: await getConversation(user._id.toString()),
          groups: await getGroupConversations(user._id.toString()),
        };
        const msgByUserConversations = {
          individual: await getConversation(msgByUserId),
          groups: await getGroupConversations(msgByUserId),
        };

        io.to(user._id.toString()).emit("conversation", userConversations);
        io.to(msgByUserId).emit("conversation", msgByUserConversations);
      }
    } catch (error) {
      console.error("Error handling seen event:", error);
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
