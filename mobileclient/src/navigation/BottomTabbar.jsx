// import React, {useState} from 'react';
// import {View, Animated} from 'react-native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {Colors} from '../theme/Colors';
// import VectorIcon from '../utils/VectorIcon';
// import {TabBarData} from '../data/TabBarData';
// import {useEffect, useRef} from 'react';

// const Tab = createBottomTabNavigator();

// const BottomTabBar = () => {
//   const {socketConnectionConnection, user} = useSelector(state => state?.user);

//   const [AllUser, setAllUser] = useState([]);
//   const [AllGroups, setAllGroups] = useState([]);

//   // socketConnection initialization
//   useEffect(() => {

//     socketConnection.on('connect', () => {
//       console.log('Connected to socketConnection server');
//     });

//     socketConnection.emit('sidebar', user._id);

//     socketConnection.on('conversation', data => {
//       console.log('conversation', data);

//       // Separate individual and group conversations
//       const individualConversations = data.individualConversations || [];
//       const groupConversations = data.groupConversations || [];

//       const conversationUserData = individualConversations.map(
//         conversationUser => {
//           if (
//             conversationUser?.sender?._id === conversationUser?.receiver?._id
//           ) {
//             return {
//               ...conversationUser,
//               userDetails: conversationUser?.sender,
//             };
//           } else if (conversationUser?.receiver?._id !== user?._id) {
//             return {
//               ...conversationUser,
//               userDetails: conversationUser.receiver,
//             };
//           } else {
//             return {
//               ...conversationUser,
//               userDetails: conversationUser.sender,
//             };
//           }
//         },
//       );

//       console.log('Side conversationUserData:', conversationUserData);
//       console.log('Side groupConversations:', groupConversations);

//       setAllUser(conversationUserData);
//       setAllGroups(groupConversations);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socketConnection.disconnect();
//       console.log('Disconnected from socketConnection server');
//     };
//   }, [user, isChat]);

//   return (
//     <Tab.Navigator
//       initialRouteName="OneToOneConversation"
//       screenOptions={({route}) => {
//         const currentTab = TabBarData.find(tab => tab.name === route.name);

//         // Animation setup for tab icon
//         const scaleAnim = useRef(new Animated.Value(1)).current;

//         useEffect(() => {
//           Animated.spring(scaleAnim, {
//             toValue: 1.1, // Scale up when active
//             friction: 2,
//             useNativeDriver: true,
//           }).start();
//         }, []);

//         return {
//           tabBarActiveTintColor: Colors.lightPurple,
//           tabBarInactiveTintColor: Colors.primary,
//           tabBarStyle: [
//             {
//               height: 62,
//               paddingHorizontal: 10,
//               backgroundColor: Colors.lightPurple,
//             },
//           ],
//           tabBarItemStyle: {
//             borderRadius: 15,
//             margin: 5,
//             padding: 1,
//           },
//           tabBarActiveBackgroundColor: Colors.primary, // Background color for active tab
//           headerShown: false,
//           tabBarIcon: ({color, size, focused}) => (
//             <Animated.View
//               style={{transform: [{scale: focused ? scaleAnim : 1}]}}>
//               <VectorIcon
//                 name={currentTab.iconName}
//                 type={currentTab.type}
//                 color={color}
//                 size={size}
//               />
//             </Animated.View>
//           ),
//         };
//       }}>
//       {TabBarData.map(tab => (
//         <Tab.Screen key={tab.id} name={tab.name} component={tab.route} />
//       ))}
//     </Tab.Navigator>
//   );
// };

// export default BottomTabBar;
import React, {useState, useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import {TabBarData} from '../data/TabBarData';
import {useDispatch, useSelector} from 'react-redux';
import {setAllUser, setAllGroups} from '../redux/userSlice';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  const {socketConnection, user} = useSelector(state => state?.user);

  const dispatch = useDispatch();

  // const [AllUser, setAllUser] = useState([]);
  // const [AllGroups, setAllGroups] = useState([]);

  // socketConnection initialization
  useEffect(() => {
    if (socketConnection) {
      socketConnection.on('connect', () => {
        console.log('Connected to socketConnection server');
      });

      socketConnection.emit('sidebar', user._id);

      socketConnection.on('conversation', data => {
        // console.log('conversation', data);

        // Separate individual and group conversations
        const individualConversations = data.individual || [];
        const groupConversations = data.groups || [];

        const conversationUserData = individualConversations.map(
          conversationUser => {
            if (
              conversationUser?.sender?._id === conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              };
            } else if (conversationUser?.receiver?._id !== user?._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          },
        );

        // console.log('Side conversations:', conversationUserData);
        // console.log('Side groupConversations:', groupConversations);

        // setAllUser(conversationUserData);
        // setAllGroups(groupConversations);

        dispatch(setAllUser(conversationUserData));
        dispatch(setAllGroups(groupConversations));
      });
    }

    // Cleanup on component unmount
    // return () => {
    //   socketConnection.disconnect();
    //   console.log('Disconnected from socketConnection server');
    // };
  }, [user, socketConnection]);

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={({route}) => {
        const currentTab = TabBarData.find(tab => tab.name === route.name);

        // Animation setup for tab icon
        const scaleAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
          Animated.spring(scaleAnim, {
            toValue: 1.1, // Scale up when active
            friction: 2,
            useNativeDriver: true,
          }).start();
        }, []);

        return {
          tabBarActiveTintColor: Colors.lightPurple,
          tabBarInactiveTintColor: Colors.primary,
          tabBarStyle: [
            {
              height: 62,
              paddingHorizontal: 10,
              backgroundColor: Colors.lightPurple,
            },
          ],
          tabBarItemStyle: {
            borderRadius: 15,
            margin: 5,
            padding: 1,
          },
          tabBarActiveBackgroundColor: Colors.primary, // Background color for active tab
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => (
            <Animated.View
              style={{transform: [{scale: focused ? scaleAnim : 1}]}}>
              <VectorIcon
                name={currentTab.iconName}
                type={currentTab.type}
                color={color}
                size={size}
              />
            </Animated.View>
          ),
        };
      }}>
      {TabBarData.map(tab => (
        <Tab.Screen
          key={tab.id}
          name={tab.name}
          component={tab.route}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabBar;
