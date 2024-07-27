const mongoose = require("mongoose");
const { GroupConversationModel } = require("../models/GroupConversationModel");

const getGroupConversations = async (currentUserId) => {
  if (currentUserId) {
    const currentUserGroupConversations = await GroupConversationModel.find({
      participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(currentUserId) } },
    })
      .sort({ updatedAt: -1 })
      .populate('messages')
      .populate('participants');

    const groupConversations = currentUserGroupConversations.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);

      return {
        _id: conv?._id,
        groupName: conv?.groupName,
        groupProfilePic: conv?.groupProfilePic,
        participants: conv?.participants,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1]
      };
    });

    return groupConversations;
  } else {
    return [];
  }
}

module.exports = getGroupConversations;
