// import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
// import React, {useState} from 'react';
// import VectorIcon from '../utils/VectorIcon';
// import {Colors} from '../theme/Colors';
// // import firestore from '@react-native-firebase/firestore';

// const ChatFooter = ({userId, chatRef}) => {
//   const [message, setMessage] = useState('');
//   const [sendEnable, setSendEnable] = useState(false);

//   const onChange = value => {
//     setMessage(value);
//     setSendEnable(true);
//   };

//   const onSend = () => {
//     // chatRef.collection('messages').add({
//     //   body: message,
//     //   sender: userId,
//     //   timestamp: firestore.FieldValue.serverTimestamp(),
//     // });
//     // setMessage('');
//     // setSendEnable(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.leftContainer}>
//         <View style={styles.row}>
//           <VectorIcon
//             type="MaterialIcons"
//             name="emoji-emotions"
//             size={24}
//             color={Colors.white}
//           />
//           <TextInput
//             placeholder="Message"
//             placeholderTextColor={Colors.textGrey}
//             onChangeText={value => onChange(value)}
//             style={styles.inputStyle}
//             value={message}
//           />
//         </View>
//         <View style={styles.row}>
//           <VectorIcon
//             type="Entypo"
//             name="attachment"
//             size={18}
//             color={Colors.white}
//           />
//           {!sendEnable && (
//             <>
//               <VectorIcon
//                 type="FontAwesome"
//                 name="rupee"
//                 size={20}
//                 color={Colors.white}
//                 style={styles.iconStyle}
//               />
//               <VectorIcon
//                 type="FontAwesome"
//                 name="camera"
//                 size={18}
//                 color={Colors.white}
//               />
//             </>
//           )}
//         </View>
//       </View>
//       <View style={styles.rightContainer}>
//         {sendEnable ? (
//           <VectorIcon
//             type="MaterialCommunityIcons"
//             name="send"
//             size={25}
//             color={Colors.primary}
//             onPress={onSend}
//           />
//         ) : (
//           <VectorIcon
//             type="MaterialCommunityIcons"
//             name="microphone"
//             size={25}
//             color={Colors.primary}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   leftContainer: {
//     width: '85%',
//     flexDirection: 'row',
//     backgroundColor: Colors.primaryColor,
//     borderRadius: 30,
//     paddingHorizontal: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   iconStyle: {
//     marginHorizontal: 25,
//   },
//   rightContainer: {
//     backgroundColor: Colors.lightPurple,
//     padding: 10,
//     borderRadius: 50,
//   },
//   inputStyle: {
//     fontSize: 17,
//     color: Colors.white,
//     marginLeft: 5,
//   },
// });

// export default ChatFooter;


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import { Colors } from '../theme/Colors';
// import { launchImageLibrary } from 'react-native-image-picker';
import uploadFile from '../helper/uploadFile';

const ChatFooter = ({ chatId, userId, isGroup }) => {
  const { socketConnection, user } = useSelector(state => state.user);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [sendEnable, setSendEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  const onChange = value => {
    setMessage(prev => ({ ...prev, text: value }));
    setSendEnable(!!value || !!message.imageUrl || !!message.videoUrl);
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleImagePicker = () => {
    // launchImageLibrary({}, response => {
    //   if (response.assets && response.assets[0].uri) {
    //     setLoading(true);
    //     uploadFile(response.assets[0].uri).then(data => {
    //       setMessage(prev => ({ ...prev, imageUrl: data.url }));
    //       setSendEnable(true);
    //       setLoading(false);
    //       setOpenImageVideoUpload(false);
    //     });
    //   }
    // });
  };

  const handleVideoPicker = () => {
    // launchImageLibrary({ mediaType: 'video' }, response => {
    //   if (response.assets && response.assets[0].uri) {
    //     setLoading(true);
    //     uploadFile(response.assets[0].uri).then(data => {
    //       setMessage(prev => ({ ...prev, videoUrl: data.url }));
    //       setSendEnable(true);
    //       setLoading(false);
    //       setOpenImageVideoUpload(false);
    //     });
    //   }
    // });
  };

  const handleClearUpload = () => {
    setMessage(prev => ({ ...prev, imageUrl: '', videoUrl: '' }));
    setSendEnable(!!message.text);
  };

  const onSend = () => {
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        const messageData = {
          sender: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: userId,
          ...(isGroup
            ? { groupId: chatId, senderName: user?.name, senderEmail: user?.email }
            : { receiver: chatId }),
        };
        socketConnection.emit(isGroup ? 'group new message' : 'new message', messageData);
        setMessage({ text: '', imageUrl: '', videoUrl: '' });
        setSendEnable(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.row}>
          <VectorIcon
            type="MaterialIcons"
            name="emoji-emotions"
            size={24}
            color={Colors.white}
          />
          <TextInput
            placeholder="Message"
            placeholderTextColor={Colors.textGrey}
            onChangeText={onChange}
            style={styles.inputStyle}
            value={message.text}
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleUploadImageVideoOpen}>
            <VectorIcon
              type="Entypo"
              name="attachment"
              size={18}
              color={Colors.white}
            />
          </TouchableOpacity>
          {openImageVideoUpload && (
            <View style={styles.uploadMenu}>
              <TouchableOpacity style={styles.uploadOption} onPress={handleImagePicker}>
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="image"
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.uploadText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadOption} onPress={handleVideoPicker}>
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="video"
                  size={18}
                  color={Colors.purple}
                />
                <Text style={styles.uploadText}>Video</Text>
              </TouchableOpacity>
            </View>
          )}
          {message.imageUrl && (
            <View style={styles.previewContainer}>
              <TouchableOpacity style={styles.closeIcon} onPress={handleClearUpload}>
                <VectorIcon
                  name="close"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={Colors.red}
                />
              </TouchableOpacity>
              <Image source={{ uri: message.imageUrl }} style={styles.previewMedia} />
            </View>
          )}
          {message.videoUrl && (
            <View style={styles.previewContainer}>
              <TouchableOpacity style={styles.closeIcon} onPress={handleClearUpload}>
                <VectorIcon
                  name="close"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={Colors.red}
                />
              </TouchableOpacity>
              <Video
                source={{ uri: message.videoUrl }}
                style={styles.previewMedia}
                useNativeControls
                isLooping={false}
              />
            </View>
          )}
          {loading && <ActivityIndicator size="small" color={Colors.primary} />}
        </View>
      </View>
      <View style={styles.rightContainer}>
        {sendEnable ? (
          <VectorIcon
            type="MaterialCommunityIcons"
            name="send"
            size={25}
            color={Colors.primary}
            onPress={onSend}
          />
        ) : (
          <VectorIcon
            type="MaterialCommunityIcons"
            name="microphone"
            size={25}
            color={Colors.primary}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    width: '85%',
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: 17,
    color: Colors.white,
    marginLeft: 5,
    flex: 1,
  },
  rightContainer: {
    backgroundColor: Colors.lightPurple,
    padding: 10,
    borderRadius: 50,
  },
  uploadMenu: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  uploadText: {
    marginLeft: 5,
    color: Colors.textColor,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  previewMedia: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default ChatFooter;