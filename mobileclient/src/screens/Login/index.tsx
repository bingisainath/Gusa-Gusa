// screens/LoginScreen.js
import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import env from 'react-native-config';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosHelper from '../../helper/axiosHelper';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // const response = await axios.post('http://yourserver.com/api/login', { email, password });
      console.log('URL : ', env.BACKEND_URL);
      const URL = 'http://192.168.0.103:8000';
      const response = await axiosHelper('post', `${URL}/api/login`, {
        email: email.toLowerCase(),
        password: password,
      });

      console.log("reposen : ",response.token);
      await AsyncStorage.setItem('token', response.token);
      navigation.replace('Chat');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={'black'}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={'black'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'black',
  },
});

export default LoginScreen;
