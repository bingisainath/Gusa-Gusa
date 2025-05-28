import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../theme/Colors'; // Adjust path to your Colors file
import NavigationManager from '../../helper/NavigationManager';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validateToken from '../../helper/validateToken';
import { setToken } from '../../redux/userSlice';

const SplashScreen = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      NavigationManager.navigateAndClear('Login');
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const isValid = await validateToken(token);
          if (isValid.status) {
            // setTokenValid(true);
            dispatch(setToken(token));
            NavigationManager.navigateAndClear('Home');
            // setIsLoading(false);
          } else {
            // setTokenValid(false);
            // setIsLoading(false);
            NavigationManager.navigateAndClear('Login');
          }
        } else {
          // setIsLoading(false);
          NavigationManager.navigateAndClear('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        // setTokenValid(false); // Ensure that the app doesn't get stuck if there's an error
      } finally {
        // setIsLoading(false); // Set loading to false whether or not the token retrieval was successful
      }
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Gusa Gusa</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary, // Match Header's background
  },
  logoText: {
    color: Colors.primary, // Match Header's color
    fontWeight: '900',
    fontSize: 40, // Larger for splash screen
  },
});

export default SplashScreen;
