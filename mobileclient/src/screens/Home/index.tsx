import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import BottomTabbar from '../../navigation/BottomTabbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import env from 'react-native-config';
import {
  logout,
  setNetworkConnection,
  setSocketConnection,
  setUser,
} from '../../redux/userSlice';

import fetchUserDetails from '../../helper/getUserDetails';
import validateToken from '../../helper/validateToken';
import networkManager from '../../helper/NetworkManager';
import NavigationManager from '../../helper/NavigationManager';

const HomeScreen = () => {
  // const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(false);

  // console.log("user", user);
  const getUserDetails = async (token: string) => {
    try {
      // const existingUser = AsyncStorage.getItem('token');

      const tokenValidation = await validateToken(token);

      if (tokenValidation.status) {
        const userResp = await fetchUserDetails();
        dispatch(setUser(userResp.data?.data));
        return userResp.data?.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log('error', error);
      dispatch(logout(true));
      NavigationManager.navigateAndClear('Login');
    }
    return null;
  };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, [navigation, dispatch]);

  // Socket initialization
  useEffect(() => {
    networkManager.isNetworkAvailable().then(res => {
      setIsNetworkAvailable(res);
      dispatch(setNetworkConnection(res));
    });

    const initializeSocket = async () => {
      const storedToken = await AsyncStorage.getItem('token');

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
