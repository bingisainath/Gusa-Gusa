import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import PhoneInput from 'react-native-phone-number-input';
import env from 'react-native-config';
import {useToast} from 'react-native-toast-notifications';

import NavigationManager from '../../helper/NavigationManager';
import CustomTextInput from '../../components/CustomTextInput';
import {Colors} from '../../theme/Colors';
import CustomButton from '../../components/CustomButton';
import axiosHelper from '../../helper/axiosHelper';

const SignUpScreen = ({navigation}) => {
  const toast = useToast();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    dob: '',
    address: '',
  });
  const [validUser, setValidUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateButtonPressed, setDateButtonPressed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirm_password: '',
    address: '',
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const validateEmail = email => {
    const pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase());
  };

  const validatePassword = password => {
    if (!password) return false; // Check for empty password
    // const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const pattern = /^[a-zA-Z].{3,5}$/;
    return pattern.test(password);
  };

  // const validatePhone = phone => {
  //   return phone.length >= 10; // Basic phone number validation
  // };

  const validateName = name => {
    return name.length >= 2;
  };

  // const validateAddress = address => {
  //   return address.length >= 5;
  // };

  const handleEmailChange = val => {
    setData({...data, email: val});
    setErrors({
      ...errors,
      email: validateEmail(val) ? '' : 'Invalid Email Address',
    });
  };

  const handleNameChange = val => {
    setData({...data, name: val});
    setErrors({
      ...errors,
      name: validateName(val) ? '' : 'Name must be at least 2 characters',
    });
  };

  const handlePasswordChange = val => {
    setData({...data, password: val});
    const setErr = validatePassword(val)
      ? ''
      : 'Password must be 8+ characters with uppercase, lowercase, and number';
    setErrors({
      ...errors,
      password: setErr,
    });
  };

  const handleConfirmPasswordChange = val => {
    setData({...data, confirm_password: val});
    setErrors({
      ...errors,
      confirmPassword: val === data.password ? '' : 'Passwords do not match',
    });
  };

  // const handleAddressChange = val => {
  //   setData({...data, address: val});
  //   setErrors({
  //     ...errors,
  //     address: validateAddress(val)
  //       ? ''
  //       : 'Address must be at least 5 characters',
  //   });
  // };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDateButtonPressed(true);
    setErrors({...errors, dob: currentDate ? '' : 'Date of Birth is required'});
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const updateSecureTextEntry = () => {
    setData({...data, secureTextEntry: !data.secureTextEntry});
  };

  const updateConfirmSecureTextEntry = () => {
    setData({...data, confirm_secureTextEntry: !data.confirm_secureTextEntry});
  };

  const handleSignUp = async () => {
    setLoading(true);

    // Validate all fields
    const newErrors = {
      email: validateEmail(data.email) ? '' : 'Invalid Email Address',
      password: validatePassword(data.password)
        ? ''
        : 'Password must be 8+ characters with uppercase, lowercase, and number',
      confirmPassword:
        data.password === data.confirm_password ? '' : 'Passwords do not match',
      name: validateName(data.name) ? '' : 'Name must be at least 2 characters',
      dob: dateButtonPressed ? '' : 'Date of Birth is required',
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).every(error => error === '')) {
      if (toggleCheckBox) {
        try {
          const stringDate = date.toString().substring(4, 15);
          const details = {
            email: data.email,
            password: data.password,
            name: data.name,
            DOB: stringDate,
            address: '',
          };

          console.log('============ details ===========');
          console.log(details);
          console.log('====================================');

          const response = await axiosHelper(
            'post',
            `${env.LOCAL_IP_URL}/api/register`,
            details,
          );

          if (response?.success) {
            toast.show('Account Created Successfully', {
              type: 'success',
              placement: 'bottom',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in',
            });
            NavigationManager.navigate('Login');
          } else {
            if (response?.error) {
              toast.show(response.message, {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
                offset: 30,
                animationType: 'slide-in',
              });
            }
            toast.show(response?.message, {
              type: 'danger',
              placement: 'bottom',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in',
            });
            // Alert.alert('Failed to register. Please try again.');
          }

          // Uncomment and implement actual API call
          // await userCreate(details);
          Alert.alert('Success', 'Sign Up Successful');
          // NavigationManager.navigate('LoginScreen'); // Navigate to login after success
        } catch (error) {
          Alert.alert('Error', 'Something went wrong. Please try again.');
          console.error('SignUp Error:', error);
        }
      } else {
        Alert.alert('Alert', 'Please accept the terms and conditions');
      }
    } else {
      Alert.alert('Alert', 'Please fill all fields correctly');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <CustomTextInput
            label="Email"
            value={data.email}
            onChangeText={handleEmailChange}
            placeholder="Your Email"
            iconName="mail-bulk"
            isPassword={false}
            errorMessage={errors.email}
            isValid={!errors.email}
          />
          <CustomTextInput
            label="Name"
            value={data.name}
            onChangeText={handleNameChange}
            placeholder="Your Name"
            iconName="user"
            isPassword={false}
            errorMessage={errors.name}
            isValid={!errors.name}
          />
          <CustomTextInput
            label="Password"
            value={data.password}
            onChangeText={handlePasswordChange}
            placeholder="Your Password"
            iconName="lock"
            isPassword={true}
            errorMessage={errors.password}
            isValid={!errors.password}
            onIconPress={updateSecureTextEntry}
          />
          <CustomTextInput
            label="Confirm Password"
            value={data.confirm_password}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Confirm Your Password"
            iconName="lock"
            isPassword={true}
            errorMessage={errors.confirmPassword}
            isValid={!errors.confirmPassword}
            onIconPress={updateConfirmSecureTextEntry}
          />

          {/* <Text style={[styles.text_footer, {marginTop: 5}]}>
            Phone Number
          </Text>
          <View
            style={{
              marginTop: 10,
              borderWidth: 2,
              borderColor: errors.phone ? Colors.error : Colors.primary,
              borderRadius: 10,
            }}>
            <PhoneInput
              defaultValue={phoneNumber}
              defaultCode="IN"
              layout="first"
              onChangeText={setPhoneNumber}
              onChangeFormattedText={setFormattedPhoneNumber}
              withDarkTheme
              withShadow
              autoFocus
              textInputStyle={{height: 48, marginLeft: 8, marginTop: 10}}
              textContainerStyle={{height: 48, paddingTop: 10}}
              containerStyle={{height: 48, borderRadius: 10}}
              codeTextStyle={{fontSize: 13, marginTop: 5}}
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View> */}

          <Text style={[styles.text_footer, {marginTop: 20}]}>
            Date of Birth
          </Text>
          <View style={styles.action}>
            <Feather
              name="clock"
              color={Colors.primary}
              size={23}
              style={{margin: 10}}
            />
            <TouchableOpacity
              onPress={showDatepicker}
              style={{
                marginTop: 2,
                backgroundColor: Colors.primary,
                marginLeft: 12,
                height: 40,
                width: '85%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                borderWidth: errors.dob ? 1 : 0,
                borderColor: Colors.error,
              }}>
              <Text style={{fontSize: 17, color: '#fff'}}>
                {dateButtonPressed ? date.toDateString() : 'MM/DD/YYYY'}
              </Text>
            </TouchableOpacity>
            {errors.dob ? (
              <Text style={styles.errorText}>{errors.dob}</Text>
            ) : null}
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              onChange={onDateChange}
              maximumDate={new Date()} // Prevent future dates
            />
          )}
          <View style={{flexDirection: 'row', marginTop: 18}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={setToggleCheckBox}
              tintColors={{true: Colors.primary, false: Colors.primary}}
            />
            <Text
              style={{
                color: '#000000',
                fontSize: 15,
                marginTop: 4,
                marginLeft: 7,
              }}>
              You Agree to our{' '}
              <Text
                onPress={() =>
                  Linking.openURL(
                    'https://www.docsapp.in/health/termsandprivacy',
                  )
                }
                style={{fontWeight: 'bold', fontSize: 16}}>
                Terms and Conditions
              </Text>
            </Text>
          </View>

          <View style={styles.button}>
            {loading ? (
              <CustomButton
                title={<ActivityIndicator size={28} color={Colors.white} />}
                style={{width: '80%'}}
                isGradient={true}
              />
            ) : (
              <CustomButton
                title="Register"
                onPress={handleSignUp}
                isGradient={true}
                style={{width: '80%'}}
              />
            )}

            <CustomButton
              title="Login"
              onPress={() => NavigationManager.goBack()}
              singleColor={Colors.white}
              style={{
                borderColor: Colors.primary,
                borderWidth: 1.2,
                marginTop: 15,
                marginBottom: 15,
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
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: Colors.primary,
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 5,
  },
  button: {
    alignItems: 'center',
    marginTop: 25,
  },
  errorText: {
    color: Colors.error || 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default SignUpScreen;
