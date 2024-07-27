const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "GroupConversation",
    },
  },
  {
    timestamps: true,
  }
);

const groupConversationSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupProfilePic: {
      type: String,
      default: "", // Assuming a default empty string for profile pic
    },
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "GroupMessage",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GroupMessageModel = mongoose.model("GroupMessage", groupMessageSchema);
const GroupConversationModel = mongoose.model(
  "GroupConversation",
  groupConversationSchema
);

module.exports = { GroupMessageModel, GroupConversationModel };
