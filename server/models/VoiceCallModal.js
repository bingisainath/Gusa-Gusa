// models/VoiceCallModel.js
const mongoose = require("mongoose");

const VoiceCallSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["missed", "completed"],
      default: "missed",
    },
  },
  {
    timestamps: true,
  }
);

const VoiceCallModel = mongoose.model("VoiceCall", VoiceCallSchema);

module.exports = VoiceCallModel;
