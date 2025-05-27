// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useRef, useEffect, useState} from 'react';
// import {Colors} from '../theme/Colors';
// import VectorIcon from '../utils/VectorIcon';
// import {MessagesData} from '../data/MessageData';

// const ChatBody = ({chatId, userId}) => {
//   const scrollViewRef = useRef();

//   const [isScrollIconVisible, setIsScrollIconVisible] = useState(false);

//   const UserMessageView = ({message, time}) => {
//     return (
//       <View style={styles.userContainer}>
//         <View style={styles.userInnerContainer}>
//           <Text style={styles.message}>{message}</Text>
//           <View style={{flexDirection: 'row'}}>
//             <Text style={styles.time}>{time}</Text>
//             <VectorIcon
//               name="check-double"
//               type="FontAwesome5"
//               color={Colors.blue}
//               size={12}
//               style={styles.doubleCheck}
//             />
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const OtherUserMessageView = ({message, time}) => {
//     return (
//       <View style={styles.otherUserContainer}>
//         <View style={styles.otherUserInnerContainer}>
//           <View style={styles.messageRow}>
//             <Text style={styles.message}>{message}</Text>
//             <Text style={styles.time}>{time}</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const scrollToBottom = () => {
//     scrollViewRef.current.scrollToEnd({animated: true});
//   };

//   const handleScroll = event => {
//     const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
//     const isAtBottom =
//       contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

//     if (isAtBottom) {
//       setIsScrollIconVisible(false); // Hide scroll icon when at bottom
//     } else {
//       setIsScrollIconVisible(true); // Show scroll icon when not at bottom
//     }
//   };

//   return (
//     <>
//       <ScrollView
//         ref={scrollViewRef}
//         onContentSizeChange={scrollToBottom}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}>
//         {MessagesData.map(item => (
//           <>
//             {item?.sender === '1234' ? (
//               <UserMessageView message={item?.body} time={item?.timestamp} />
//             ) : (
//               <OtherUserMessageView
//                 message={item?.body}
//                 time={item?.timestamp}
//               />
//             )}
//           </>
//         ))}
//       </ScrollView>
//       {isScrollIconVisible && (
//         <TouchableOpacity style={styles.scrollIcon} onPress={scrollToBottom}>
//           <View style={styles.scrollDownArrow}>
//             <VectorIcon
//               name="angle-dobule-down"
//               type="Fontisto"
//               size={12}
//               color={Colors.white}
//             />
//           </View>
//         </TouchableOpacity>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   userContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginVertical: 5,
//     marginLeft: 20,
//   },
//   userInnerContainer: {
//     maxWidth: '95%',
//     backgroundColor: Colors.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderTopLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     borderBottomLeftRadius: 30,
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   otherUserContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginRight: 40,
//     // backgroundColor:'red'
//   },
//   otherUserInnerContainer: {
//     maxWidth: '95%',
//     backgroundColor: Colors.lightPurple,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderTopRightRadius: 30,
//     borderBottomRightRadius: 30,
//     borderBottomLeftRadius: 30,
//     flexDirection: 'column',
//     // alignItems: 'flex-end',
//   },
//   messageRow: {
//     // flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Ensures message and time are on opposite sides
//     alignItems: 'flex-end',
//   },
//   message: {
//     fontSize: 13,
//     color: Colors.white,
//   },
//   time: {
//     fontSize: 9,
//     color: Colors.white,
//     marginLeft: 5,
//   },
//   doubleCheck: {
//     marginLeft: 5,
//   },
//   scrollDownArrow: {
//     backgroundColor: Colors.lightPurple,
//     borderRadius: 50,
//     height: 30,
//     width: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   scrollIcon: {
//     position: 'absolute',
//     bottom: 5,
//     right: 15,
//   },
// });

// export default ChatBody;


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import { Colors } from '../theme/Colors';
import moment from 'moment';
// import { Video } from 'expo-av'; // Ensure expo-av is installed

const ChatBody = ({ chatId, userId, isGroup }) => {
  const { socketConnection } = useSelector(state => state.user);
  const [messages, setMessages] = useState([]);
  const [isScrollIconVisible, setIsScrollIconVisible] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (socketConnection) {
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
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleScroll = event => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setIsScrollIconVisible(!isAtBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const UserMessageView = ({ message, time, imageUrl, videoUrl, senderName }) => (
    <View style={styles.userContainer}>
      <View style={styles.userInnerContainer}>
        {isGroup && <Text style={styles.senderName}>{senderName}</Text>}
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.media} />}
        {/* {videoUrl && (
          <Video
            source={{ uri: videoUrl }}
            style={styles.media}
            useNativeControls
            isLooping={false}
          />
        )} */}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={{ flexDirection: 'row' }}>
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

  const OtherUserMessageView = ({ message, time, imageUrl, videoUrl, senderName }) => (
    <View style={styles.otherUserContainer}>
      <View style={styles.otherUserInnerContainer}>
        {isGroup && <Text style={styles.senderName}>{senderName}</Text>}
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.media} />}
        {/* {videoUrl && (
          <Video
            source={{ uri: videoUrl }}
            style={styles.media}
            useNativeControls
            isLooping={false}
          />
        )} */}
        <View style={styles.messageRow}>
          {message && <Text style={styles.message}>{message}</Text>}
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
                // videoUrl={item.videoUrl}
                senderName={item.senderName}
              />
            ) : (
              <OtherUserMessageView
                message={item.text}
                time={item.createdAt}
                imageUrl={item.imageUrl}
                // videoUrl={item.videoUrl}
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
              name="angle-double-down"
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
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 40,
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
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 5,
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default ChatBody;