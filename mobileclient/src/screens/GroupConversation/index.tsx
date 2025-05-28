// import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
// import React, {useState, useEffect} from 'react';
// import ChatList from '../../components/ChatList'; // Adjusted path if needed
// import VectorIcon from '../../utils/VectorIcon';
// import {Colors} from '../../theme/Colors';
// import {useNavigation, useRoute} from '@react-navigation/native';

// const GroupConversation = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {socket, currentUser} = route.params || {}; // Socket and user from App.js
//   const [groups, setGroups] = useState([]);

//   useEffect(() => {
//     if (socket) {
//       // Listen for conversation updates
//       socket.on('conversation', data => {
//         setGroups(data.groups || []);
//       });

//       // Request conversation list
//       socket.emit('sidebar', currentUser?._id);

//       socket.on('error', error => {
//         console.error('Socket error:', error.message);
//       });

//       return () => {
//         socket.off('conversation');
//         socket.off('error');
//       };
//     }
//   }, [socket, currentUser]);

//   const onNavigate = () => {
//     // Optionally navigate to a screen to create a new group
//     console.log('Navigate to create new group');
//     // navigation.navigate('CreateGroup'); // Implement if needed
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <ChatList userId={currentUser?._id} groups={groups} isGroup />
//       </ScrollView>
//       <TouchableOpacity style={styles.contactIcon} onPress={onNavigate}>
//         <VectorIcon
//           name="account-group"
//           type="MaterialCommunityIcons"
//           size={22}
//           color={Colors.primary}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     backgroundColor: Colors.primary,
//     flex: 1,
//     paddingTop: 5,
//   },
//   contactIcon: {
//     backgroundColor: Colors.lightPurple,
//     height: 50,
//     width: 50,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
// });

// export default GroupConversation;

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import ChatList from '../../components/ChatList';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../theme/Colors';
import {useNavigation} from '@react-navigation/native';

const GroupConversation = () => {

  

  const navigation = useNavigation();
  const {socketConnection, user, AllGroups} = useSelector(state => state?.user);
  // const [groups, setGroups] = useState(groups);

  // console.log('=========== groups ===========');
  // console.log(AllGroups);
  // console.log('====================================');

  const onNavigate = () => {
    // navigation.navigate('CreateGroup'); // Implement if needed
    console.log('Create Group');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={user?._id} data={AllGroups} isGroup />
      </ScrollView>
      <TouchableOpacity style={styles.contactIcon} onPress={onNavigate}>
        <VectorIcon
          name="account-group"
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
    paddingTop: 5,
  },
  contactIcon: {
    backgroundColor: Colors.secondary,
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

export default GroupConversation;
