import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import networkManager from '../helper/NetworkManager';
import {useDispatch} from 'react-redux';
import {setNetworkConnection} from '../redux/userSlice';

const Header = () => {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   networkManager.isNetworkAvailable().then(res => {
  //     setIsNetworkAvailable(res);
  //     dispatch(setNetworkConnection(res));
  //   });
  // }, []);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected && state.isInternetReachable;
      setIsNetworkAvailable(isConnected);
      dispatch(setNetworkConnection(isConnected));
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <View>
      {!isNetworkAvailable ? (
        <View
          style={{
            backgroundColor: Colors.red,
            padding: 5,
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            No Internet Connection
          </Text>
        </View>
      ) : null}

      <View style={styles.container}>
        {/* <Image source={WhatsappLogo} style={styles.logoStyle} /> */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Gusa Gusa</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <VectorIcon
              type="Feather"
              name="camera"
              color={Colors.primary}
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <VectorIcon
              type="Ionicons"
              name="search"
              color={Colors.primary}
              size={20}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <VectorIcon
              type="Entypo"
              name="dots-three-vertical"
              color={Colors.primary}
              size={18}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoStyle: {
    height: 25,
    width: 110,
  },
  logoContainer: {},
  logoText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 25,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginHorizontal: 25,
  },
});

export default Header;
