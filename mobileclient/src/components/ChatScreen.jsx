import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import ChatHeader from '../components/ChatHeader';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import Wallpaper from '../assets/wallpaper.jpeg';

const ChatScreen = () => {
  const route = useRoute();
  const {socketConnection, user} = useSelector(state => state.user);
  const {isGroup, contactId, groupId, userData, groupData} = route.params || {};

  console.log('=============Is Group ========');
  console.log(isGroup);
  console.log('====================================');

  // const isGroup = !!groupId;
  const [data, setData] = useState({
    name: '',
    profile_pic: '',
    _id: '',
    online: false,
  });

  useEffect(() => {
    if (socketConnection) {
      const event = isGroup ? 'group-message-page' : 'message-page';
      const id = isGroup ? groupId : contactId;
      socketConnection.emit(event, id);
      socketConnection.emit('seen', id, isGroup);

      socketConnection.on(isGroup ? 'message-group' : 'message-user', data => {
        setData(data);
      });

      return () => {
        socketConnection.off(isGroup ? 'message-group' : 'message-user');
      };
    }
  }, [socketConnection, contactId, groupId, isGroup]);

  return (
    <View style={styles.container}>
      <ChatHeader data={isGroup ? groupData : userData} isGroup={isGroup} />
      <ImageBackground source={Wallpaper} style={styles.wallpaper}>
        <ChatBody
          chatId={isGroup ? groupId : contactId}
          userId={user?._id}
          isGroup={isGroup}
        />
      </ImageBackground>
      <ChatFooter
        chatId={isGroup ? groupId : contactId}
        userId={user?._id}
        isGroup={isGroup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wallpaper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
});

export default ChatScreen;
