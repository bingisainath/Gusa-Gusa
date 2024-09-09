// // // screens/ChatScreen.js
// // import React, {useEffect, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   TextInput,
// //   Button,
// //   StyleSheet,
// //   TouchableOpacity,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import io from 'socket.io-client';

// // import env from 'react-native-config';
// // import {useDispatch, useSelector} from 'react-redux';
// // import {setToken} from '../../redux/userSlice';

// // const ChatScreen = ({navigation}) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [allUsers, setAllUsers] = useState(null);

// //   const token = useSelector(state => state.user.token);

// //   // const socketConnection = useSelector(state => state?.user?.socketConnection);

// //   // console.log("chat Screen called");

// //   // Socket initialization
// //   useEffect(() => {
// //     console.log(env?.LOCAL_IP_URL);
// //     console.log(token);

// //     const socket = io(env?.LOCAL_IP_URL, {
// //       auth: {token: token},
// //     });

// //     console.log('================= socket called ===================');
// //     console.log(socket.id);
// //     console.log('====================================');

// //     socket.on('conversation', data => {
// //       // Separate individual and group conversations
// //       const individualConversations = data.individualConversations || [];
// //       const groupConversations = data.groupConversations || [];

// //       const conversationUserData = individualConversations.map(
// //         conversationUser => {
// //           if (
// //             conversationUser?.sender?._id === conversationUser?.receiver?._id
// //           ) {
// //             return {
// //               ...conversationUser,
// //               userDetails: conversationUser?.sender,
// //             };
// //           } else if (conversationUser?.receiver?._id !== user?._id) {
// //             return {
// //               ...conversationUser,
// //               userDetails: conversationUser.receiver,
// //             };
// //           } else {
// //             return {
// //               ...conversationUser,
// //               userDetails: conversationUser.sender,
// //             };
// //           }
// //         },
// //       );

// //       console.log('================= conversationUserData ===================');
// //       console.log(conversationUserData);
// //       console.log('====================================');

// //       setAllUsers(conversationUserData);
// //       // setAllGroups(groupConversations);
// //     });

// //     // Cleanup on component unmount
// //     // return () => {
// //     //   socket.disconnect();
// //     //   console.log("Disconnected from socket server");
// //     // };
// //   }, []);

// //   const dispatch = useDispatch();

// //   const logout = async () => {
// //     console.log('====================================');
// //     console.log('logout Called');
// //     console.log('====================================');
// //     await AsyncStorage.setItem('token', '');
// //     dispatch(setToken(''));
// //     navigation.replace('Login');
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* <FlatList
// //         data={messages}
// //         keyExtractor={(item, index) => index.toString()}
// //         renderItem={({ item }) => (
// //           <View style={styles.messageContainer}>
// //             <Text>{item.text}</Text>
// //           </View>
// //         )}
// //       /> */}
// //       <TextInput
// //         style={styles.input}
// //         value={newMessage}
// //         onChangeText={setNewMessage}
// //         placeholder="Type a message"
// //       />
// //       <Button title="Send" />
// //       <TouchableOpacity
// //         onPress={logout}
// //         style={{
// //           backgroundColor: 'red',
// //           padding: 10,
// //           margin: 10,
// //           alignItems: 'center',
// //         }}>
// //         <Text style={{color: 'black'}}>Logout</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     padding: 16,
// //   },
// //   input: {
// //     height: 40,
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     marginBottom: 12,
// //     paddingHorizontal: 8,
// //   },
// //   messageContainer: {
// //     padding: 8,
// //     borderBottomColor: '#ccc',
// //     borderBottomWidth: 1,
// //   },
// // });

// // export default ChatScreen;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import io from 'socket.io-client';
// import env from 'react-native-config';
// import {useDispatch, useSelector} from 'react-redux';
// import {setToken} from '../../redux/userSlice';

// const ChatScreen = ({navigation}) => {
//   const dispatch = useDispatch();
//   const socketConnection = useSelector(state => state?.user?.socketConnection);
//   const token = useSelector(state => state.user.token);

//   const user = useSelector(state => state.user);

//   console.log('================= one to one token ===================');
//   console.log(token);
//   console.log('====================================');

//   console.log('================= one to one user ===================');
//   console.log(user);
//   console.log('====================================');

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [allUsers, setAllUsers] = useState([]);
//   const [chats, setChats] = useState();

//   useEffect(() => {
//     if (socketConnection) {
//       socketConnection.emit('sidebar', user._id);

//       const handleConversation = data => {
//         // console.log("All chat conversation", data);

//         const individualConversations = data.individual || [];
//         const groupConversations = data.groups || [];

//         // console.log("individualConversations : ", individualConversations);

//         const conversationUserData = individualConversations.map(
//           conversationUser => {
//             if (
//               conversationUser?.sender?._id === conversationUser?.receiver?._id
//             ) {
//               return {
//                 ...conversationUser,
//                 userDetails: conversationUser?.sender,
//               };
//             } else if (conversationUser?.receiver?._id !== user?._id) {
//               return {
//                 ...conversationUser,
//                 userDetails: conversationUser.receiver,
//               };
//             } else {
//               return {
//                 ...conversationUser,
//                 userDetails: conversationUser.sender,
//               };
//             }
//           },
//         );

//         setChats(conversationUserData);

//         console.log('==== conversationUserData =======');
//         console.log(conversationUserData);
//         console.log('====================================');

//         // if (active == 'chat') {
//         //   setChats(conversationUserData);
//         // } else if (active == 'groupChat') {
//         //   setChats(groupConversations);
//         // }
//       };

//       socketConnection.on('conversation', handleConversation);

//       // Cleanup function to remove listener when component unmounts or dependencies change
//       return () => {
//         socketConnection.off('conversation', handleConversation);
//       };
//     }
//   }, [socketConnection, user]);

//   const logout = async () => {
//     console.log('Logging out');
//     await AsyncStorage.removeItem('token');
//     dispatch(setToken(''));
//     navigation.replace('Login');
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         value={newMessage}
//         onChangeText={setNewMessage}
//         placeholder="Type a message"
//       />
//       <Button title="Send" />
//       <TouchableOpacity onPress={logout} style={styles.logoutButton}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
//   logoutButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     margin: 10,
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: 'white',
//   },
// });

// export default ChatScreen;

import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import ChatList from '../../components/ChatList';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../theme/Colors';
import {useNavigation} from '@react-navigation/native';
// import {getDeviceId} from '../utils/helper';

const ChatListScreen = ({navigation}) => {
  // const navigation = useNavigation();

  const [userId, setUserId] = useState();

  // useEffect(() => {
  //   getDeviceId().then(id => setUserId(id));
  // }, []);

  //   const logout = async () => {
//     console.log('Logging out');
//     await AsyncStorage.removeItem('token');
//     dispatch(setToken(''));
//     navigation.replace('Login');
//   };

  const onNavigate = () => {
    console.log('====================================');
    console.log("ON Navigate pressed");
    console.log('====================================');
    navigation.navigate('Chat', {
      userId: '1234',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={'1234'} />
      </ScrollView>
      <TouchableOpacity style={styles.contactIcon} onPress={onNavigate}>
        <VectorIcon
          name="message-reply-text"
          type="MaterialCommunityIcons"
          size={22}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.primary,
    flex: 1,
    paddingTop: 5
  },
  contactIcon: {
    backgroundColor: Colors.lightPurple,
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default ChatListScreen;
