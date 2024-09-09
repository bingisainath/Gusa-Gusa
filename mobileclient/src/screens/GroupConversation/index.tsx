// screens/GroupChatScreen.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/userSlice';

const GroupConversation = ({navigation}) => {
  // const { groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();
  // const navigation = useNavigation();

  // useEffect(() => {
  //   const initializeSocket = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     const newSocket = io('http://yourserver.com', {
  //       auth: { token },
  //     });

  //     newSocket.on('connect', () => {
  //       console.log('Connected to socket server');
  //       newSocket.emit('group-message-page', groupId);
  //     });

  //     newSocket.on('group-message', (message) => {
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //     });

  //     setSocket(newSocket);

  //     return () => newSocket.disconnect();
  //   };

  //   initializeSocket();
  // }, [groupId]);

  // const sendMessage = () => {
  //   if (socket) {
  //     socket.emit('new message', { text: newMessage, groupId });
  //     setNewMessage('');
  //   }
  // };

  const logout = async () => {
    console.log('Logging out');
    await AsyncStorage.removeItem('token');
    dispatch(setToken(''));
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text>{item.text}</Text>
          </View>
        )}
      /> */}
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message"
      />
      <Button title="Send" />

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: 'red',
          alignItems: 'center',
          padding: 10,
          margin: 10,
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  messageContainer: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default GroupConversation;
