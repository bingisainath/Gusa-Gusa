// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import VectorIcon from '../utils/VectorIcon';
// import { Colors } from '../theme/Colors';
// import moment from 'moment';

// const ChatList = ({ userId, data = [], isGroup = false }) => {
//   const navigation = useNavigation();

//   const onNavigate = (id, item) => {
//     if (isGroup) {
//       navigation.navigate('GroupChat', {
//         groupId: id,
//         userId,
//         groupData: item,
//       });
//     } else {
//       navigation.navigate('Chat', {
//         contactId: id,
//         userId,
//         userData: item.userDetails,
//       });
//     }
//   };

//   return (
//     <>
//       {data.map(item => (
//         <TouchableOpacity
//           key={item._id}
//           onPress={() => onNavigate(item._id, item)}
//           style={styles.container}>
//           <View style={styles.leftContainer}>
//             {isGroup ? (
//               item.profile_pic ? (
//                 <Image source={{ uri: item.profile_pic }} style={styles.profileImg} />
//               ) : (
//                 <VectorIcon
//                   type="MaterialCommunityIcons"
//                   name="account-group"
//                   size={40}
//                   color={Colors.textGrey}
//                   style={styles.profileImg}
//                 />
//               )
//             ) : (
//               <Image
//                 source={{ uri: item.userDetails?.profile_pic }}
//                 style={styles.profileImg}
//               />
//             )}
//             <View>
//               <Text style={styles.username}>
//                 {isGroup ? item.name : item.userDetails?.name}
//               </Text>
//               <Text style={styles.message}>
//                 {item.lastMessage?.text || 'No messages yet'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.rightContainer}>
//             <Text style={styles.timeStamp}>
//               {item.lastMessage?.createdAt
//                 ? moment(item.lastMessage.createdAt).format('hh:mm')
//                 : ''}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   profileImg: {
//     borderRadius: 50,
//     height: 40,
//     width: 40,
//     marginRight: 15,
//   },
//   container: {
//     backgroundColor: Colors.primary,
//     borderBottomWidth: 0.5,
//     borderColor: Colors.textGrey,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   username: {
//     color: Colors.textColor,
//     fontSize: 16,
//   },
//   message: {
//     color: Colors.textGrey,
//     fontSize: 14,
//     marginTop: 5,
//   },
//   leftContainer: {
//     flexDirection: 'row',
//   },
//   timeStamp: {
//     color: Colors.textGrey,
//     fontSize: 12,
//   },
// });

// export default ChatList;

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';
import moment from 'moment';

const ChatList = ({userId, data = [], isGroup = false}) => {
  const navigation = useNavigation();

  const onNavigate = (id, item) => {
    if (isGroup) {
      navigation.navigate('GroupChat', {
        groupId: id,
        userId,
        groupData: item,
      });
    } else {
      navigation.navigate('Chat', {
        contactId: id,
        userId,
        userData: item.userDetails,
      });
    }
  };

  // Function to truncate long text and add ellipsis
  const truncateText = (text, maxLength = 30) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Function to render the last message content
  const renderLastMessage = lastMsg => {
    if (lastMsg?.imageUrl) {
      return (
        <View style={styles.messageContainer}>
          <VectorIcon
            type="Ionicons"
            name="image-outline"
            size={16}
            color={Colors.textGrey}
            style={styles.messageIcon}
          />
          <Text style={styles.message}>Image</Text>
        </View>
      );
    } else if (lastMsg?.videoUrl) {
      return (
        <View style={styles.messageContainer}>
          <VectorIcon
            type="Ionicons"
            name="videocam-outline"
            size={16}
            color={Colors.textGrey}
            style={styles.messageIcon}
          />
          <Text style={styles.message}>Video</Text>
        </View>
      );
    } else if (lastMsg?.text) {
      return <Text style={styles.message}>{truncateText(lastMsg.text)}</Text>;
    } else {
      return <Text style={styles.message}>No messages yet</Text>;
    }
  };

  return (
    <>
      {data.map(item => (
        <TouchableOpacity
          key={item._id}
          onPress={() => onNavigate(item._id, item)}
          style={styles.container}>
          <View style={styles.leftContainer}>
            {isGroup ? (
              item.groupProfilePic ? (
                <Image
                  source={{uri: item.groupProfilePic}}
                  style={styles.profileImg}
                />
              ) : (
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="account-group"
                  size={40}
                  color={Colors.textGrey}
                  style={styles.profileImg}
                />
              )
            ) : item.userDetails?.profile_pic ? (
              <Image
                source={{uri: item.userDetails?.profile_pic}}
                style={styles.profileImg}
              />
            ) : (
              <VectorIcon
                type="MaterialCommunityIcons"
                name="account"
                size={40}
                color={Colors.textGrey}
                style={styles.profileImg}
              />
            )}
            <View>
              <Text style={styles.username}>
                {isGroup
                  ? item.groupName
                  : item.userDetails?.name || 'Unknown User'}
              </Text>
              {/* <Text style={styles.message}>
                {item.lastMsg?.text || 'No messages yet'}
              </Text> */}
              {renderLastMessage(item.lastMsg)}
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.timeStamp}>
              {item.lastMsg?.createdAt
                ? moment(item.lastMsg.createdAt).format('hh:mm')
                : ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 50,
    height: 40,
    width: 40,
    marginRight: 15,
  },
  container: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 0.5,
    borderColor: Colors.textGrey,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: Colors.textColor,
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  message: {
    color: Colors.textGrey,
    fontSize: 14,
  },
  messageIcon: {
    marginRight: 5,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  rightContainer: {
    justifyContent: 'center',
  },
  timeStamp: {
    color: Colors.textGrey,
    fontSize: 12,
  },
});

export default ChatList;
