// server/sockets/groupChat.js
const { GroupMessageModel, GroupConversationModel } = require('../models/GroupConversationModel');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const getGroupConversations = require('../helpers/getGroupConversation');

const groupChat = (namespace) => {
  const onlineUser = new Set();

  namespace.on('connection', async (socket) => {
    console.log('Group chat user connected', socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user || !user._id) {
      console.error('Invalid user details, disconnecting socket:', socket.id);
      socket.emit('error', { message: 'Authentication failed. Please log in again.' });
      socket.disconnect();
      return;
    }

    socket.join(user._id.toString());
    onlineUser.add(user._id.toString());

    namespace.emit('onlineUser', Array.from(onlineUser));

    socket.on('group-message-page', async (groupId) => {
      if (!groupId) {
        console.error('Invalid groupId provided for group-message-page event');
        socket.emit('error', { message: 'Group ID is missing.' });
        return;
      }

      try {
        const groupDetails = await GroupConversationModel.findById(groupId).populate('participants', 'name profile_pic');
        const payload = {
          _id: groupDetails._id,
          name: groupDetails.name,
          profile_pic: groupDetails.profile_pic,
          participants: groupDetails.participants,
        };
        socket.emit('message-group', payload);

        const getGroupMessages = await GroupConversationModel.findById(groupId)
          .populate('messages')
          .sort({ updatedAt: -1 });

        socket.emit('group-message', getGroupMessages.messages || []);
      } catch (error) {
        console.error('Error fetching group-message-page data:', error);
      }
    });

    socket.on('new group message', async (data) => {
      if (!data || !data.groupId) {
        console.error('Invalid data provided for new group message event');
        socket.emit('error', { message: 'Message data is incomplete.' });
        return;
      }

      try {
        let conversation = await GroupConversationModel.findById(data.groupId);
        if (!conversation) {
          conversation = new GroupConversationModel({ group: data.groupId });
          await conversation.save();
        }

        const message = new GroupMessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
          groupId: data.groupId,
        });
        const saveMessage = await message.save();

        await GroupConversationModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: saveMessage._id } }
        );

        const getGroupMessages = await GroupConversationModel.findById(data.groupId)
          .populate('messages')
          .sort({ updatedAt: -1 });

        namespace.to(data.groupId).emit('group-message', getGroupMessages.messages || []);

        const conversationGroup = await getGroupConversations(data.groupId);

        namespace.to(data.groupId).emit('group-conversation-update', { groupConversations: conversationGroup });
      } catch (error) {
        console.error('Error handling new group message event:', error);
      }
    });

    socket.on('sidebar', async (currentUserId) => {
      if (!currentUserId) {
        console.error('currentUserId is undefined');
        socket.emit('error', { message: 'Current user ID is missing.' });
        return;
      }
      try {
        const individualConversations = await getConversation(currentUserId);
        const groupConversations = await getGroupConversations(currentUserId);

        const conversations = {
          individualConversations,
          groupConversations,
        };

        socket.emit('conversation', conversations);
      } catch (e) {
        console.error('Error handling sidebar event:', e);
      }
    });

    socket.on('disconnect', () => {
      if (user._id) {
        onlineUser.delete(user._id.toString());
      }
      console.log('Group chat user disconnected', socket.id);
    });
  });
};

module.exports = groupChat;
