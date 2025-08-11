import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import Video from 'react-native-video';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';
import moment from 'moment';

const ChatBody = ({chatId, userId, isGroup}) => {
  const {socketConnection} = useSelector(state => state.user);
  const [messages, setMessages] = useState([]);
  const [isScrollIconVisible, setIsScrollIconVisible] = useState(false);
  const scrollViewRef = useRef();

  console.log('============ chat body =============');
  console.log(chatId);
  console.log('====================================');

  useEffect(() => {
    if (socketConnection) {
      isGroup
        ? (socketConnection.emit('group-message-page', chatId),
          socketConnection.emit('seen', chatId, true))
        : (socketConnection.emit('message-page', chatId),
          socketConnection.emit('seen', chatId));

      socketConnection.on(isGroup ? 'group-message' : 'user-message', data => {
        setMessages(data);
      });

      return () => {
        socketConnection.off(isGroup ? 'group-message' : 'user-message');
      };
    }
  }, [socketConnection, isGroup]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const handleScroll = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setIsScrollIconVisible(!isAtBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const UserMessageView = ({message, time, imageUrl, videoUrl, senderName}) => (
    <View style={styles.userContainer}>
      <View
        style={[
          styles.userInnerContainer,
          (imageUrl || videoUrl) && styles.userMediaContainer,
        ]}>
        {isGroup && <Text style={styles.UserSenderName}>{senderName}</Text>}
        {imageUrl && <Image source={{uri: imageUrl}} style={styles.media} />}
        {videoUrl && (
          <Video
            source={{uri: videoUrl}}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
          />
        )}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.messageFooter}>
          <Text style={styles.time}>{moment(time).format('hh:mm')}</Text>
          <VectorIcon
            name="check-double"
            type="FontAwesome5"
            color={Colors.blue}
            size={12}
            style={styles.doubleCheck}
          />
        </View>
      </View>
    </View>
  );

  const OtherUserMessageView = ({
    message,
    time,
    imageUrl,
    videoUrl,
    senderName,
  }) => (
    <View style={styles.otherUserContainer}>
      <View
        style={[
          styles.otherUserInnerContainer,
          (imageUrl || videoUrl) && styles.OtherUserMediaContainer,
        ]}>
        {isGroup && (
          <Text style={styles.otherUserSenderName}>{senderName}</Text>
        )}
        {imageUrl && <Image source={{uri: imageUrl}} style={styles.media} />}
        {videoUrl && (
          <Video
            source={{uri: videoUrl}}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
          />
        )}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.messageFooter}>
          <Text style={styles.time}>{moment(time).format('hh:mm')}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {messages.map((item, index) => (
          <View key={index}>
            {item.msgByUserId === userId ? (
              <UserMessageView
                message={item.text}
                time={item.createdAt}
                imageUrl={item.imageUrl}
                videoUrl={item.videoUrl}
                senderName={item.senderName}
              />
            ) : (
              <OtherUserMessageView
                message={item.text}
                time={item.createdAt}
                imageUrl={item.imageUrl}
                videoUrl={item.videoUrl}
                senderName={item.senderName}
              />
            )}
          </View>
        ))}
      </ScrollView>
      {isScrollIconVisible && (
        <TouchableOpacity style={styles.scrollIcon} onPress={scrollToBottom}>
          <View style={styles.scrollDownArrow}>
            <VectorIcon
              name="angle-dobule-down"
              type="Fontisto"
              size={12}
              color={Colors.white}
            />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  userInnerContainer: {
    maxWidth: '80%',
    backgroundColor: Colors.primary,
    padding: 10,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  otherUserContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  otherUserInnerContainer: {
    maxWidth: '80%',
    backgroundColor: Colors.secondary,
    padding: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userMediaContainer: {
    padding: 5,
    backgroundColor: Colors.primary, // Darker background for media messages
    borderRadius: 15,
  },
  OtherUserMediaContainer: {
    padding: 5,
    backgroundColor: Colors.secondary, // Darker background for media messages
    borderRadius: 15,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  message: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  time: {
    fontSize: 10,
    color: Colors.white,
    opacity: 0.7,
    marginLeft: 5,
  },
  doubleCheck: {
    marginLeft: 5,
  },
  scrollDownArrow: {
    backgroundColor: Colors.secondary,
    borderRadius: 50,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scrollIcon: {
    position: 'absolute',
    bottom: 10,
    right: 15,
  },
  UserSenderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.secondary,
    opacity: 0.9,
    // marginBottom: 6,
  },
  otherUserSenderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    opacity: 0.9,
    // marginBottom: 6,
  },
  media: {
    width: 240,
    height: 240,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: Colors.black,
  },
});

export default ChatBody;
