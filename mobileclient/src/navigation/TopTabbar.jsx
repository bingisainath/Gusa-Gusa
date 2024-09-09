// import React, {useEffect, useRef} from 'react';
// import {View, Animated} from 'react-native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {Colors} from '../theme/Colors';
// import VectorIcon from '../utils/VectorIcon';
// import {TabBarData} from '../data/TabBarData';

// const Tab = createBottomTabNavigator();

// const BottomTabBar = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="OneToOneConversation"
//       screenOptions={({route}) => {
//         const currentTab = TabBarData.find(tab => tab.name === route.name);
//         return {
//           tabBarActiveTintColor: Colors.primary,
//           tabBarInactiveTintColor: Colors.purpleGrey,
//           tabBarStyle: [
//             {
//               height: 60,
//               paddingBottom: 7,
//               paddingTop: 10,
//               backgroundColor: Colors.lightPurple,
//               // borderTopLeftRadius: 20,
//               // borderTopRightRadius: 20,
//             },
//           ],
//           headerShown: false,
//           tabBarIcon: ({color, size}) => (
//             <VectorIcon
//               name={currentTab.iconName}
//               type={currentTab.type}
//               color={color}
//               size={size}
//             />
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

import React from 'react';
import {View, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import {TabBarData} from '../data/TabBarData';
import {useEffect, useRef} from 'react';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="OneToOneConversation"
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
            padding:1
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
        <Tab.Screen key={tab.id} name={tab.name} component={tab.route} />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabBar;
