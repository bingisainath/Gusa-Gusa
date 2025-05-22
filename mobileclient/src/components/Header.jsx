import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';

const Header = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightPurple,
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
