import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import {MessagesData} from '../data/MessageData';

const ChatBody = ({chatId, userId}) => {
  const scrollViewRef = useRef();

  const [isScrollIconVisible, setIsScrollIconVisible] = useState(false);

  const UserMessageView = ({message, time}) => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userInnerContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.time}>{time}</Text>
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
  };

  const OtherUserMessageView = ({message, time}) => {
    return (
      <View style={styles.otherUserContainer}>
        <View style={styles.otherUserInnerContainer}>
          <View style={styles.messageRow}>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
      </View>
    );
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const handleScroll = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

    if (isAtBottom) {
      setIsScrollIconVisible(false); // Hide scroll icon when at bottom
    } else {
      setIsScrollIconVisible(true); // Show scroll icon when not at bottom
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {MessagesData.map(item => (
          <>
            {item?.sender === '1234' ? (
              <UserMessageView message={item?.body} time={item?.timestamp} />
            ) : (
              <OtherUserMessageView
                message={item?.body}
                time={item?.timestamp}
              />
            )}
          </>
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
    marginVertical: 5,
    marginLeft: 20,
  },
  userInnerContainer: {
    maxWidth: '95%',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 40,
    // backgroundColor:'red'
  },
  otherUserInnerContainer: {
    maxWidth: '95%',
    backgroundColor: Colors.lightPurple,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    flexDirection: 'column',
    // alignItems: 'flex-end',
  },
  messageRow: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures message and time are on opposite sides
    alignItems: 'flex-end',
  },
  message: {
    fontSize: 13,
    color: Colors.white,
  },
  time: {
    fontSize: 9,
    color: Colors.white,
    marginLeft: 5,
  },
  doubleCheck: {
    marginLeft: 5,
  },
  scrollDownArrow: {
    backgroundColor: Colors.lightPurple,
    borderRadius: 50,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollIcon: {
    position: 'absolute',
    bottom: 5,
    right: 15,
  },
});

export default ChatBody;
