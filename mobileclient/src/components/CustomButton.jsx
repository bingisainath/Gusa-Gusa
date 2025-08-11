import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme/Colors';

const CustomButton = ({
  title, // Required
  onPress = () => {},
  isGradient = false,
  singleColor = Colors.primary,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {isGradient ? (
        <LinearGradient
          colors={['#370f4d', '#4D146B', '#661F8C']}
          style={styles.signIn}>
          <Text style={[styles.textSign, textStyle]}>{title}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.signIn, {backgroundColor: singleColor}]}>
          <Text style={[styles.textSign, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // borderWidth:1
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CustomButton;
