const { GroupConversationModel } = require("../models/GroupConversationModel");

const CreateGroup = async (request, response) => {
  const { groupName, groupProfilePic, participants } = request.body;

  if (!groupName || !participants || participants.length === 0) {
    return response.status(400).send({ error: "Group name and participants are required" });
  }

  try {

    const newGroupChat = new GroupConversationModel({
      groupName,
      groupProfilePic,
      participants,
    });
    await newGroupChat.save();

    return response.json({
      message: "Group Created Successfully",
      data: newGroupChat,
      success: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({ error: "Error creating group chat" });
  }
};

module.exports = CreateGroup;
