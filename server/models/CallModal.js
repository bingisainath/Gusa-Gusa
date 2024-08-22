// // models/CallModel.js
// const mongoose = require("mongoose");

// const CallSchema = new mongoose.Schema(
//   {
//     caller: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     startTime: {
//       type: Date,
//       default: Date.now,
//     },
//     endTime: {
//       type: Date,
//     },
//     duration: {
//       type: Number, // Duration in seconds
//       default: 0,
//     },
//     status: {
//       type: String,
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save hook to calculate the duration if endTime is set
// CallSchema.pre('save', function (next) {
//   if (this.endTime) {
//     const start = new Date(this.startTime);
//     const end = new Date(this.endTime);
//     this.duration = Math.round((end - start) / 1000); // Duration in seconds
//   }
//   next();
// });

// const CallModel = mongoose.model("Call", CallSchema);

// module.exports = CallModel;

const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema(
  {
    roomId:{
      type: String,
      ref: "User",
      required: true,
    },
    caller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    status: {
      type: String,
      default: "missed",
    },
  },
  {
    timestamps: true,
  }
);

const CallModel = mongoose.model("Call", CallSchema);

module.exports = CallModel;
