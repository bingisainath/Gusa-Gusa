// import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
// import React, {useState, useEffect} from 'react';
// import ChatList from '../../components/ChatList';
// import VectorIcon from '../../utils/VectorIcon';
// import {Colors} from '../../theme/Colors';
// import {useNavigation} from '@react-navigation/native';

// const OneToOneConversation = ({navigation}) => {

//   const [userId, setUserId] = useState();

//   const onNavigate = () => {
//     navigation.navigate('Chat', {
//       userId: '1234',
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <ChatList userId={'1234'} />
//       </ScrollView>
//       <TouchableOpacity style={styles.contactIcon} onPress={onNavigate}>
//         <VectorIcon
//           name="message-reply-text"
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
//     paddingTop: 5
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

// export default OneToOneConversation;

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import ChatList from '../../components/ChatList';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../theme/Colors';
import {useNavigation} from '@react-navigation/native';

const OneToOneConversation = () => {
  const navigation = useNavigation();
  const {socketConnection, user, AllUser} = useSelector(state => state?.user);
  // const [users, setUsers] = useState([]);

  const onNavigate = () => {
    // Navigate to a screen to search/add new users
    navigation.navigate('SearchUser'); // Implement if needed
  };

  console.log('=========== users ===========');
  console.log(AllUser);
  console.log('====================================');

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={user?._id} data={AllUser} isGroup={false} />
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
    paddingTop: 5,
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

export default OneToOneConversation;
