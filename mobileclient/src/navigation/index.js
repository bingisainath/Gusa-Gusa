// navigation/index.js
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login/index';
import ChatScreen from '../screens/OnetoOneConversation/index';
import GroupChatScreen from '../screens/GroupConversation/index';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
