const {
  GroupConversationModel,
  GroupMessageModel,
} = require("../models/GroupConversationModel");
const getGroupConversations = require("../helpers/getGroupConversation");
const getConversation = require("../helpers/getConversation");

async function handleGroupMessagePage(io, socket, user, groupId) {
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
    const getGroupMessages = await GroupConversationModel.findById(groupId)
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("group-message", getGroupMessages?.messages || []);
  } catch (error) {
    console.error("Error fetching group-message-page data:", error);
  }
}

async function handleGroupNewMessage(io, socket, user, data) {
  console.log("group data : ", data);

  try {
    let conversation = await GroupConversationModel.findById(data.groupId);
    if (!conversation) {
      conversation = new GroupConversationModel({ group: data.groupId });
      await conversation.save();
    }
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
    const individualConversations = await getConversation(data.sender);
    const groupConversations = await getGroupConversations(data.sender);
    const conversations = {
      individual: individualConversations,
      groups: groupConversations,
    };
    io.to(data.sender).emit("conversation", conversations);
  } catch (error) {
    console.error("Error handling new group message event:", error);
  }
}

const handleGroupSeen = async (socket, user, msgByUserId, io) => {
  try {
    const groupConversation = await GroupConversationModel.findById(msgByUserId);

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
  } catch (error) {
    console.error("Error handling group seen event:", error);
  }
};

module.exports = {
  handleGroupMessagePage,
  handleGroupNewMessage,
  handleGroupSeen
};