import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../theme/Colors'; // Adjust path to your Colors file
import NavigationManager from '../../helper/NavigationManager';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import validateToken from '../../helper/validateToken';
import {setToken} from '../../redux/userSlice';

const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkToken();
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const isValid = await validateToken(token);
        if (isValid.status) {
          dispatch(setToken(token));
          NavigationManager.navigateAndClear('Home');
        } else {
          NavigationManager.navigateAndClear('Login');
        }
      } else {
        NavigationManager.navigateAndClear('Login');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      NavigationManager.navigateAndClear('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animatable.Image
          animation="bounce"
          iterationCount={5}
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <Text style={styles.logoText}>Gusa Gusa</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darkBackground, // Match Header's background
  },
  logoText: {
    color: Colors.secondary, // Match Header's color
    fontWeight: '900',
    fontSize: 40, // Larger for splash screen
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 300,
    width: 300,
  },
});

export default SplashScreen;
