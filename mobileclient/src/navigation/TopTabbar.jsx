import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import {TabBarData} from '../data/TabBarData';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="OneToOneConversation"
      screenOptions={({route}) => {
        const currentTab = TabBarData.find(tab => tab.name === route.name);
        return {
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.grey,
          tabBarStyle: [
            {
              height: 60,
              paddingBottom: 7,
              paddingTop: 10,
              backgroundColor: Colors.lightPurple,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          ],
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <VectorIcon
              name={currentTab.iconName}
              type={currentTab.type}
              color={color}
              size={size}
            />
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
