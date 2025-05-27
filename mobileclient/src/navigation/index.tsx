// navigation/index.js
import React, {useState, useEffect} from 'react';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/Login/index';
import HomeScreen from '../screens/Home';
import ChatScreen from '../components/ChatScreen';
import ProfileScreen from '../components/profile';

import {Colors} from '../theme/Colors';
import validateToken from '../helper/validateToken';
import {useDispatch} from 'react-redux';
import {setToken} from '../redux/userSlice';

const Stack = createStackNavigator();

function AppNavigator({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const isValid = await validateToken(token);

          console.log('=============Nav Token =========');
          console.log(isValid);
          console.log('====================================');

          if (isValid.status) {
            setTokenValid(true);
            dispatch(setToken(token));
            setIsLoading(false);
          } else {
            setTokenValid(false);
            setIsLoading(false);
            navigation.navigate('Login');
          }
        } else {
          setIsLoading(false);
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        setTokenValid(false); // Ensure that the app doesn't get stuck if there's an error
      } finally {
        setIsLoading(false); // Set loading to false whether or not the token retrieval was successful
      }
    };
    checkToken();
  }, []);

  // if (isLoading) {
  //   // Show a loading indicator while checking the token
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" color={Colors.lightPurple} />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.primary} />
      <Stack.Navigator initialRouteName={tokenValid ? 'Home' : 'Login'}>
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
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
