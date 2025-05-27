import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../components/Header';
import BottomTabbar from '../../navigation/BottomTabbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import env from 'react-native-config';
import {logout, setSocketConnection, setUser} from '../../redux/userSlice';

import fetchUserDetails from '../../helper/getUserDetails';
import validateToken from '../../helper/validateToken';

const HomeScreen = ({navigation}) => {
  // const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  // console.log("user", user);
  const getUserDetails = async (token: string) => {
    try {
      // const existingUser = AsyncStorage.getItem('token');

      const tokenValidation = await validateToken(token);

      // console.log('======== tokenValidation ==========');
      // console.log(tokenValidation);
      // console.log('====================================');

      if (tokenValidation.status) {
        const userResp = await fetchUserDetails();

        // console.log('======== userResp =======');
        // console.log(userResp.data?.data);
        // console.log('====================================');

        dispatch(setUser(userResp.data?.data));
        return userResp.data?.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log('error', error);
      dispatch(logout(true));
      navigation.replace('Login');
    }
    return null;
  };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, [navigation, dispatch]);

  // Socket initialization
  useEffect(() => {
    const initializeSocket = async () => {
      const storedToken = await AsyncStorage.getItem('token');

      // console.log('======== storedToken =======');
      // console.log(storedToken);
      // console.log('====================================');

      const user = await getUserDetails(storedToken);

      if (user) {
        const socket = io(`${env.LOCAL_IP_URL}`, {
          auth: {token: storedToken},
        });

        socket.on('connect', () => {
          console.log('Connected to socket server');
          dispatch(setSocketConnection(socket));
          // dispatch(setUser(user));
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from socket server');
          dispatch(setSocketConnection(null));
        });
      }
    };

    initializeSocket();
  }, []);

  

  return (
    <>
      <Header />
      <BottomTabbar />
    </>
  );
};

export default HomeScreen;
