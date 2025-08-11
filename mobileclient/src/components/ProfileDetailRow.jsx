import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';

const ProfileDetailRow = ({
  iconName,
  iconType,
  iconColor,
  label,
  value,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <VectorIcon
        name={iconName}
        type={iconType}
        size={25}
        color={iconColor}
        style={styles.icon}
      />
      <View style={styles.rowContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <VectorIcon
        name="angle-right"
        type="FontAwesome"
        size={25}
        color="#000"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: 20,
    shadowOpacity: 20,
  },
  rowContent: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  icon: {
    width: 30,
  },
});

export default ProfileDetailRow;
