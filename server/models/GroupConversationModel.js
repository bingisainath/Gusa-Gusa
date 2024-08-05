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
    seenBy: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        seen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    senderName: {
      type: String,
      default: "",
    },
    senderEmail: {
      type: String,
      default: "",
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
      default: "",
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        userEmail: {
          type: String,
          required: true,
        },
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
