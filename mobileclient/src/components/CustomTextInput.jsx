import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../theme/Colors';

const CustomTextInput = ({
  label, // Required
  value = '',
  onChangeText = () => {},
  onEndEditing = () => {},
  placeholder = '',
  iconName = 'user',
  isPassword = false,
  errorMessage = '',
  isValid = true,
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.text_footer}>{label}</Text>
      <View
        style={[
          styles.action,
          !isValid && errorMessage ? styles.actionError : null,
        ]}>
        <FontAwesome5 name={iconName} color={Colors.primary} size={20} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.primary}
          style={styles.textInput}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          secureTextEntry={secureTextEntry}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecureEntry}>
            <Feather
              name={secureTextEntry ? 'eye-off' : 'eye'}
              color={Colors.primary}
              size={20}
            />
          </TouchableOpacity>
        )}
        {isValid && value.length > 0 && (
          <Animatable.View animation="bounceIn" style={{marginLeft: 15}}>
            <Feather name="check-circle" color="green" size={20} />
          </Animatable.View>
        )}
      </View>
      {!isValid && errorMessage && (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>{errorMessage}</Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
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
    borderBottomColor: Colors.error,
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
});

export default CustomTextInput;
