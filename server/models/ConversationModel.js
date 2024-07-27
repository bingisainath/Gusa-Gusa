const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// const groupConversationSchema = new mongoose.Schema(
//   {
//     groupName: {
//       type: String,
//       required: true,
//     },
//     groupProfilePic: {
//       type: String,
//       default: '', // Assuming a default empty string for profile pic
//     },
//     participants: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//       },
//     ],
//     messages: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Message',
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

const MessageModel = mongoose.model("Message", messageSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);
// const GroupConversationModel = mongoose.model(
//   "GroupConversation",
//   groupConversationSchema
// );

module.exports = {
  MessageModel,
  ConversationModel,
};
