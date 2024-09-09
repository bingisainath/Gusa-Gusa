import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from 'react-native-config';
import {useDispatch, UseDispatch} from 'react-redux';

import {useTheme} from 'react-native-paper';
import {Colors} from '../../theme/Colors';
import axiosHelper from '../../helper/axiosHelper';
import {setToken} from '../../redux/userSlice';

// import { AuthContext } from '../components/context';

// import { userAuth } from '../ServerApis/UserApis';

const SignInScreen = ({navigation}) => {
  const [Emailerror, setEmailError] = useState('');
  const [Passerror, setPassError] = useState('');
  const [validUser, setValidUser] = useState(false);

  const dispatch = useDispatch();

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

  const {colors} = useTheme();

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
              console.log('=============== login token =====================');
              console.log(response.token);
              console.log('====================================');
              await AsyncStorage.setItem('token', response?.token);
              dispatch(setToken(response?.token));
              navigation.replace('Home');
            } else {
              Alert.alert('Login Failed', response.message);
            }
          } catch (e) {
            console.log('================ error ====================');
            console.log(e);
            console.log(e?.data);
            console.log('====================================');
            Alert.alert('Login Failed', e?.data);
          }
        } else {
          Alert.alert(
            'Login Failed',
            'Invalid Credentials',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      } else {
        Alert.alert('Invalid Password');
      }
    } else {
      Alert.alert('Invalid Email');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Animatable.Image
            animation="bounceIn"
            duraton="1500"
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        {/** Add Image here */}
        {/* <Animatable.Image
          animation="bounceIn"
          // duraton="1500"
          source={require('../../assets/icon.png')}
          style={styles.logo}
          // resizeMode="stretch"
        />
        <Text style={styles.text_header}>Welcome!</Text> */}
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text
          style={[
            styles.text_footer,
            {
              color: Colors.primary,
            },
          ]}>
          Email
        </Text>
        <View style={styles.action}>
          <FontAwesome5 name="user" color={Colors.primary} size={20} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor={'grey'}
            style={[
              styles.textInput,
              {
                color: Colors.primary,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{Emailerror}</Text>
          </Animatable.View>
        )}

        <Text
          style={[
            styles.text_footer,
            {
              color: Colors.primary,
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={Colors.primary} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor={'grey'}
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: Colors.primary,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{Passerror}</Text>
          </Animatable.View>
        )}
        <TouchableOpacity>
          <Text style={{color: Colors.lightPurple, marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={() => loginHandle()}>
            <LinearGradient
              colors={['#671e8f', Colors.primary]}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => navigation.navigate("SignUpScreen")}
            style={[
              styles.signIn,
              {
                borderColor: Colors.primary,
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: Colors.primary,
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the logo
  },
  textContainer: {
    alignItems: 'flex-start', // Align the header text at the start (top)
  },
  logo: {
    height: 250,
    width: 250,
  },
  text_header: {
    color: Colors.lightPurple,
    fontWeight: 'bold',
    fontSize: 30,
  },
  footer: {
    flex: 1.5,
    backgroundColor: Colors.lightPurple,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: Colors.lightPurple,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 15,
  },

  text_footer: {
    color: '#05375a',
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
    borderBottomColor: Colors.red,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: Colors.red,
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
    borderColor: Colors.purple,
    borderWidth: 1,
    marginTop: 15,
    shadowColor: Colors.purple,
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
