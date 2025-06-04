import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from 'react-native-config';
import {useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {useToast} from 'react-native-toast-notifications';

import {useTheme} from 'react-native-paper';
import {Colors} from '../../theme/Colors';
import axiosHelper from '../../helper/axiosHelper';
import {
  setNetworkConnection,
  setSocketConnection,
  setToken,
  setUser,
} from '../../redux/userSlice';
import {io} from 'socket.io-client';
import validateToken from '../../helper/validateToken';
import NavigationManager from '../../helper/NavigationManager';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

const SignInScreen = ({navigation}) => {
  const [Emailerror, setEmailError] = useState('');
  const [Passerror, setPassError] = useState('');
  const [validUser, setValidUser] = useState(false);
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(false);
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const isEmailValid = email => {
    let Pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Pattern.test(String(email).toLowerCase())
      ? setEmailError('')
      : setEmailError('Invalid Email Address');
  };

  const isPasswordValid = password => {
    let Pattern = /^[a-zA-Z].{7,10}$/;
    Pattern.test(String(password).toLowerCase())
      ? setPassError('')
      : setPassError('Invalid Password Address');
  };

  const [data, setData] = useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  // const {colors} = useTheme();

  const textInputChange = val => {
    isEmailValid(val);
    isPasswordValid(val);

    if (Passerror == '' || Emailerror == '') {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = val => {
    isPasswordValid(val);

    if (Passerror == '') {
      setValidUser(true);
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setValidUser(false);
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidEmail = val => {
    isEmailValid(val);
    if (Emailerror == '') {
      setValidUser(true);
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setValidUser(false);
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = async () => {
    setLoading(true);
    if (Emailerror == '') {
      if (Passerror == '' || Passerror == 'Invalid Password Address') {
        const details = {
          email: data.username,
          password: data.password,
        };
        if (details.email != '' && details.password != '') {
          try {
            const response = await axiosHelper(
              'post',
              `${env.LOCAL_IP_URL}/api/login`,
              {
                email: details.email.toLowerCase(),
                password: details.password,
              },
            );
            console.log('response : ', response);
            console.log('token : ', response.token);
            if (response.success) {
              await AsyncStorage.setItem('token', response?.token);
              dispatch(setToken(response?.token));
              toast.show('Logged Successfully', {
                type: 'success',
                placement: 'bottom',
                duration: 4000,
                offset: 30,
                animationType: 'slide-in',
              });
              NavigationManager.navigateAndClear('Home');
            } else {
              // Alert.alert('Login Failed', response.message);
              toast.show(`Login Failed ${response?.message}`, {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
                offset: 30,
                animationType: 'slide-in',
              });
            }
          } catch (e) {
            // Alert.alert('Login Failed', e?.data);
            toast.show(`Login Failed ${e?.data}`, {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in',
            });
          }
          setLoading(false);
        } else {
          toast.show(`Login Failed, Invalid Credentials`, {
            type: 'danger',
            placement: 'bottom',
            duration: 4000,
            offset: 30,
            animationType: 'slide-in',
          });
          setLoading(false);
        }
      } else {
        // Alert.alert('Invalid Password');
        toast.show(`Invalid Password`, {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        });
        setLoading(false);
      }
    } else {
      // Alert.alert('Invalid Email');
      toast.show(`Invalid Email`, {
        type: 'danger',
        placement: 'bottom',
        duration: 3000,
        offset: 30,
        animationType: 'slide-in',
      });
      setLoading(false);
    }
  };

  const registerHandle = () => {
    NavigationManager.navigate('Register');
    // NavigationManager.goBack();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected && state.isInternetReachable;
      setIsNetworkAvailable(isConnected);
      dispatch(setNetworkConnection(isConnected));
    });

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const isValid = await validateToken(token);
          if (isValid.status) {
            NavigationManager.navigateAndClear('Home');
          }
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    checkToken();

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {!isNetworkAvailable ? (
        <View
          style={{
            backgroundColor: Colors.error,
            padding: 5,
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            No Internet Connection
          </Text>
        </View>
      ) : null}
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Animatable.Image
            animation="bounce"
            // duration="1500"
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <CustomTextInput
          label="Email"
          value={data.username}
          onChangeText={textInputChange}
          onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
          placeholder="Your Email"
          iconName="user"
          isPassword={false}
          errorMessage={Emailerror}
          isValid={data.isValidUser}
        />
        <CustomTextInput
          label="Password"
          value={data.password}
          onChangeText={handlePasswordChange}
          placeholder="Your Password"
          iconName="lock"
          isPassword={true}
          errorMessage={Passerror}
          isValid={data.isValidPassword}
        />
        <TouchableOpacity>
          <Text style={{color: Colors.primary, marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          {Loading ? (
            <CustomButton
              title={<ActivityIndicator size={28} color={Colors.white} />}
              style={{width: '80%'}}
              // onPress={() => {}}
              isGradient={true}
            />
          ) : (
            <CustomButton
              title="Login"
              onPress={loginHandle}
              isGradient={true}
              style={{width: '80%'}}
            />
          )}
          <CustomButton
            title="Register"
            onPress={registerHandle}
            singleColor={Colors.white}
            style={{
              borderColor: Colors.primary,
              borderWidth: 1.2,
              marginTop: 15,
              width: '80%',
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            textStyle={{color: Colors.primary}}
          />
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  logo: {
    height: 250,
    width: 250,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  footer: {
    flex: 1.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 15,
  },
  text_footer: {
    color: Colors.primary,
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.error,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: Colors.primary,
  },
  errorMsg: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signUp: {
    borderColor: Colors.primary,
    borderWidth: 1,
    marginTop: 15,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
