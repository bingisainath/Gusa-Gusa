// server/sockets/normalChat.js
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const UserModel = require('../models/UserModel');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const getConversation = require('../helpers/getConversation');

const normalChat = (namespace) => {
  const onlineUser = new Set();

  namespace.on('connection', async (socket) => {
    console.log('Normal chat user connected', socket.id);

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

    socket.on('message-page', async (userId) => {
      if (!userId) {
        console.error('Invalid userId provided for message-page event');
        socket.emit('error', { message: 'User ID is missing.' });
        return;
      }

      try {
        const userDetails = await UserModel.findById(userId).select('-password');
        const payload = {
          _id: userDetails._id,
          name: userDetails.name,
          email: userDetails.email,
          profile_pic: userDetails.profile_pic,
          online: onlineUser.has(userId),
        };
        socket.emit('message-user', payload);

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: user._id, receiver: userId },
            { sender: userId, receiver: user._id },
          ],
        })
          .populate('messages')
          .sort({ updatedAt: -1 });

        socket.emit('message', getConversationMessage.messages || []);
      } catch (error) {
        console.error('Error fetching message-page data:', error);
      }
    });

    socket.on('new message', async (data) => {
      if (!data || !data.sender) {
        console.error('Invalid data provided for new message event');
        socket.emit('error', { message: 'Message data is incomplete.' });
        return;
      }

      try {
        let conversation = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender },
          ],
        });
        if (!conversation) {
          conversation = new ConversationModel({
            sender: data.sender,
            receiver: data.receiver,
          });
          await conversation.save();
        }

        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
        });
        const saveMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: saveMessage._id } }
        );

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender },
          ],
        })
          .populate('messages')
          .sort({ updatedAt: -1 });

        namespace.to(data.sender).emit('message', getConversationMessage.messages || []);
        namespace.to(data.receiver).emit('message', getConversationMessage.messages || []);

        const conversationSender = await getConversation(data.sender);
        const conversationReceiver = await getConversation(data.receiver);

        namespace.to(data.sender).emit('conversation-update', { individualConversations: conversationSender });
        namespace.to(data.receiver).emit('conversation-update', { individualConversations: conversationReceiver });
      } catch (error) {
        console.error('Error handling new message event:', error);
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
      console.log('Normal chat user disconnected', socket.id);
    });
  });
};

module.exports = normalChat;
