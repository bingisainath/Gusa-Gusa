import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import ChatHeader from '../components/ChatHeader';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import Wallpaper from '../assets/wallpaper.jpeg';
import DarkWallpaper from '../assets/darkWallpaper.png';
import LogManager from '../helper/LogManager';

const ChatScreen = () => {
  const route = useRoute();
  const {socketConnection, user} = useSelector(state => state.user);
  const {isGroup, contactId, groupId, userData, groupData} = route.params || {};

  const darkTheme = false;

  const wallpaper = darkTheme ? DarkWallpaper : Wallpaper;

  const [data, setData] = useState({
    name: '',
    profile_pic: '',
    _id: '',
    online: false,
  });

  useEffect(() => {
    // Set initial data based on whether it's a group or individual chat
    if (isGroup && groupData) {
      setData({
        name: groupData.groupName || '',
        profile_pic: groupData.groupProfilePic || '',
        _id: groupData._id || '',
        online: false, // Groups don't have an online status
      });
    } else if (!isGroup && userData) {
      setData({
        name: userData.name || '',
        profile_pic: userData.profile_pic || '',
        _id: userData._id || '',
        online: userData.online || false,
      });
    }
  }, [isGroup, userData, groupData]);

  useEffect(() => {
    if (socketConnection) {
      // const event = isGroup ? 'group-message-page' : 'message-page';
      const id = isGroup ? groupId : userData._id;
      // LogManager.info('Event : ', event, id);
      // socketConnection.emit(event, id);
      socketConnection.emit('message-page', userData?._id);
      socketConnection.emit('group-message-page', groupId);
      socketConnection.emit('seen', id, isGroup);

      return () => {
        socketConnection.off(isGroup ? 'message-group' : 'message-user');
      };
    }
  }, [socketConnection, contactId, groupId, isGroup]);

  return (
    <View style={styles.container}>
      <ChatHeader data={data} isGroup={isGroup} userId={user?._id} />
      <ImageBackground source={wallpaper} style={styles.wallpaper}>
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
        data={data}
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
