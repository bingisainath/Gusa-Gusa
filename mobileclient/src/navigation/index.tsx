// navigation/index.js
import React, {useState, useEffect} from 'react';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/Login/index';
// import ChatScreen from '../screens/OnetoOneConversation/index';
import GroupChatScreen from '../screens/GroupConversation/index';
import HomeScreen from '../screens/Home';
import ChatScreen from '../components/ChatScreen';

import {Colors} from '../theme/Colors';

const Stack = createStackNavigator();

function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setUserToken(token);
      } catch (error) {
        console.error('Error retrieving token:', error);
        setUserToken(null); // Ensure that the app doesn't get stuck if there's an error
      } finally {
        setIsLoading(false); // Set loading to false whether or not the token retrieval was successful
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking the token
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.primary} />
      <Stack.Navigator initialRouteName={userToken ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
