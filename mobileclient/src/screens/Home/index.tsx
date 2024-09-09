import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../components/Header';
import TopTabBar from '../../navigation/TopTabbar';
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

      if (tokenValidation?.status) {
        const userResp = await fetchUserDetails();

        // if (!userResp.status) {
        //   console.log(' ========= No token is available ');
        //   console.log('token ', userResp?.error);
        //   dispatch(logout(true));
        //   navigation.replace('Login');
        // }

        // if (!userResp?.data?.logout) {
        //   console.log(' ========= Logout ');
        //   console.log('token ', userResp?.error);
        //   dispatch(logout(true));
        //   navigation.replace('Login');
        // }

        console.log('====================================');
        console.log('response : ', userResp?.data?.data);
        console.log('====================================');

        dispatch(setUser(userResp.data?.data));
      } else {
        console.log('====================================');
        console.log(tokenValidation?.error);
        console.log('====================================');
      }
    } catch (error) {
      console.log('error', error);
      dispatch(logout(true));
      navigation.replace('Login');
    }
  };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, [navigation, dispatch]);

  // Socket initialization
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('token');
        getUserDetails(storedToken);
        // fetchUserDetails(storedToken);
        console.log('Stored Token:', storedToken);

        // Initialize the socket connection with token authentication
        const socket = await io(env?.LOCAL_IP_URL || 'http://localhost:8000', {
          auth: {token: storedToken},
          transports: ['websocket', 'polling'],
        });

        dispatch(setSocketConnection(socket));

        socket.on('onlineUser', data => {
          console.log(data);
          // dispatch(setOnlineUser(data));
        });

        socket.on('conversation', data => {
          // console.log("conversation", data);

          // Separate individual and group conversations
          const individualConversations = data.individualConversations || [];
          const groupConversations = data.groupConversations || [];

          const conversationUserData = individualConversations.map(
            conversationUser => {
              if (
                conversationUser?.sender?._id ===
                conversationUser?.receiver?._id
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

          // console.log('======== conversationUserData=======');
          // console.log(conversationUserData);
          // console.log('====================================');

          // setAllUser(conversationUserData);
          // setAllGroups(groupConversations);
        });

        //   dispatch(setSocketConnection(socketConnection));

        // Cleanup on component unmount
        // return () => {
        //   socket.disconnect();
        //   console.log('Disconnected from socket server');
        // };
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();
  }, []);

  return (
    <>
      <Header />
      <TopTabBar />
    </>
  );
};

export default HomeScreen;
