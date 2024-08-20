// const UserModel = require("../models/UserModel");
// const CallModel = require("../models/CallModal");

// async function handleCallUser(io, socket, user, to, onlineUser) {
//   if (!to) {
//     console.error("Invalid recipient ID provided for call-user event");
//     socket.emit("error", { message: "Recipient ID is missing." });
//     return;
//   }

//   try {
//     // Fetch the details of the receiver
//     const receiverDetails = await UserModel.findById(to).select("-password");

//     // Create a new call entry
//     const call = new CallModel({
//       caller: user._id,
//       receiver: to,
//       startTime: new Date(),
//       status: "pending", // Initial status
//     });
//     await call.save();

//     // Emit call details to the receiver
//     io.to(to).emit("call-made", {
//       caller: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         profile_pic: user.profile_pic,
//       },
//       receiver: {
//         _id: receiverDetails._id,
//         name: receiverDetails.name,
//         email: receiverDetails.email,
//         profile_pic: receiverDetails.profile_pic,
//       },
//       callId: call._id,
//     });
//   } catch (error) {
//     console.error("Error handling call-user event:", error);
//     socket.emit("error", { message: "Error processing call request." });
//   }
// }

// module.exports = {
//   handleCallUser,
// };

const UserModel = require("../models/UserModel");
const CallModel = require("../models/CallModal");

async function handleCallUser(io, socket, user, to, onlineUser) {
  if (!to) {
    console.error("Invalid recipient ID provided for call-user event");
    socket.emit("error", { message: "Recipient ID is missing." });
    return;
  }

  try {
    // Fetch the details of the receiver
    const receiverDetails = await UserModel.findById(to).select("-password");

    // Create a new call entry
    const call = new CallModel({
      caller: user._id,
      receiver: to,
      startTime: new Date(),
      status: "missed", // Initial status
    });
    await call.save();

    // Create a room for the call
    const roomId = call._id.toString();
    socket.join(roomId);
    console.log("roomId : ", roomId);
    console.log("callId : ", call._id);

    // Prepare call details
    const callDetails = {
      callId: call._id,
      roomId: roomId,
      caller: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        peerId: user.peerId,
      },
      receiver: {
        _id: receiverDetails._id,
        name: receiverDetails.name,
        email: receiverDetails.email,
        profile_pic: receiverDetails.profile_pic,
        peerId: receiverDetails.peerId,
      },
    };

    // Emit call details to the receiver
    io.to(to).emit("call-made", callDetails);

    // Emit call details to the caller
    io.to(user._id.toString()).emit("calling", callDetails);
  } catch (error) {
    console.error("Error handling call-user event:", error);
    socket.emit("error", { message: "Error processing call request." });
  }
}

module.exports = {
  handleCallUser,
};
