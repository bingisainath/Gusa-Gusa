import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';
import uploadFile from '../helper/uploadFile';

const ChatFooter = ({chatId, data, isGroup}) => {

  console.log('=========== footer =========================');
  console.log(chatId);
  console.log('====================================');

  const {socketConnection, user} = useSelector(state => state.user);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [sendEnable, setSendEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  const onChange = value => {
    setMessage(prev => ({...prev, text: value}));
    setSendEnable(!!value || !!message.imageUrl || !!message.videoUrl);
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleImagePicker = async () => {
    // Note: Since react-native-image-picker is commented out in the original code,
    // we'll assume a file picker mechanism is available. Replace with actual implementation.
    // For demonstration, we'll simulate file selection.
    try {
      setLoading(true);
      // Replace with actual file picker logic (e.g., react-native-image-picker)
      const file = await new Promise(resolve => {
        // Simulate file selection (replace with actual file picker)
        resolve({uri: 'some-file-uri'});
      });
      const uploadResult = await uploadFile(file.uri);
      setMessage(prev => ({...prev, imageUrl: uploadResult.url}));
      setSendEnable(true);
      setOpenImageVideoUpload(false);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPicker = async () => {
    try {
      setLoading(true);
      // Replace with actual file picker logic for video
      const file = await new Promise(resolve => {
        // Simulate video selection (replace with actual file picker)
        resolve({uri: 'some-video-uri'});
      });
      const uploadResult = await uploadFile(file.uri);
      setMessage(prev => ({...prev, videoUrl: uploadResult.url}));
      setSendEnable(true);
      setOpenImageVideoUpload(false);
    } catch (error) {
      console.error('Video upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearUpload = () => {
    setMessage(prev => ({...prev, imageUrl: '', videoUrl: ''}));
    setSendEnable(!!message.text);
  };

  const handleSendMessage = () => {
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        if (isGroup) {
          // Group message
          socketConnection.emit('group new message', {
            sender: user?._id,
            text: message.text,
            imageUrl: message.imageUrl,
            videoUrl: message.videoUrl,
            msgByUserId: user?._id,
            groupId: chatId,
            senderName: user?.name,
            senderEmail: user?.email,
          });
        } else {

          // Individual message
          socketConnection.emit('new message', {
            sender: user?._id,
            receiver: data._id,
            text: message.text,
            imageUrl: message.imageUrl,
            videoUrl: message.videoUrl,
            msgByUserId: user?._id,
          });
        }
        // Clear message input after sending
        setMessage({
          text: '',
          imageUrl: '',
          videoUrl: '',
        });
        setSendEnable(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.row}>
          <TouchableOpacity>
            <VectorIcon
              type="MaterialIcons"
              name="emoji-emotions"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleImagePicker}>
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="image"
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.uploadText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleVideoPicker}>
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="video"
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.uploadText}>Video</Text>
              </TouchableOpacity>
            </View>
          )}
          {message.imageUrl && (
            <View style={styles.previewContainer}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={handleClearUpload}>
                <VectorIcon
                  name="close"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={Colors.red}
                />
              </TouchableOpacity>
              <Image
                source={{uri: message.imageUrl}}
                style={styles.previewMedia}
              />
            </View>
          )}
          {message.videoUrl && (
            <View style={styles.previewContainer}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={handleClearUpload}>
                <VectorIcon
                  name="close"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={Colors.red}
                />
              </TouchableOpacity>
              <Video
                source={{uri: message.videoUrl}}
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
        <TouchableOpacity onPress={handleSendMessage}>
          <VectorIcon
            type="MaterialCommunityIcons"
            name={sendEnable ? 'send' : 'microphone'}
            size={25}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 14,
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
    backgroundColor: Colors.primary, // Adjusted from red to match theme
    paddingRight: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: 17,
    color: Colors.white,
    marginHorizontal: 5,
    flex: 1,
    paddingHorizontal: 5,
  },
  rightContainer: {
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 50,
    marginRight: 4,
  },
  uploadMenu: {
    position: 'absolute',
    bottom: 50,
    left: -20,
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
