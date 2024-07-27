// const mongoose = require("mongoose");

// // Group chat schema
// const groupSchema = new mongoose.Schema(
//   {
//     groupName: {
//       type: String,
//       required: true,
//     },
//     groupProfilePic: {
//       type: String,
//       default: "",
//     },
//     participants: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//     ],
//     messages: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: "Message",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// const GroupModel = mongoose.model("Group", groupSchema);

// module.exports = GroupModel;
