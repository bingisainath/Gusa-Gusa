const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
// const UserModel = require("../models/userModel");
const UserModel = require("../models/UserModel");
const getConversation = require("../helpers/getConversation");
const getGroupConversations = require("../helpers/getGroupConversation");

async function handleMessagePage(io, socket, user, userId, onlineUser) {
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
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    // console.log("getConversationMessage :", getConversationMessage);

    socket.emit("user-message", getConversationMessage?.messages || []);
  } catch (error) {
    console.error("Error fetching message-page data:", error);
  }
}

async function handleIndividualNewMessage(io, socket, user, data) {
  try {
    let conversation = await ConversationModel.findOne({
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
    const individualConversations = await getConversation(data.sender);
    const groupConversations = await getGroupConversations(data.sender);
    const conversations = {
      individual: individualConversations,
      groups: groupConversations,
    };
    io.to(data.sender).emit("conversation", conversations);
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
  } catch (error) {
    console.error("Error handling new individual message event:", error);
  }
}

const handleOneToOneSeen = async (socket, user, msgByUserId, io) => {
  try {
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
  } catch (error) {
    console.error("Error handling one-to-one seen event:", error);
  }
};

module.exports = {
  handleMessagePage,
  handleIndividualNewMessage,
  handleOneToOneSeen,
};
