import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';
import NavigationManager from '../helper/NavigationManager';

const ChatHeader = ({data, isGroup, userId}) => {

  const {socketConnection, user} = useSelector(state => state.user);

  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', userId);
      socketConnection.on('message-user', data => {
        setOnline(data?.online);
      });
    }
  }, [socketConnection, user]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <VectorIcon
          name="arrow-back"
          type="Ionicons"
          size={24}
          color={Colors.white}
          onPress={() => NavigationManager.goBack()}
        />
        {data?.profile_pic ? (
          <Image source={{uri: data.profile_pic}} style={styles.profilePhoto} />
        ) : (
          <VectorIcon
            name="account-group"
            type="MaterialCommunityIcons"
            size={40}
            color={Colors.white}
            style={styles.profilePhoto}
          />
        )}
        <View style={styles.textContainer}>
          <Text
            style={styles.username}
            numberOfLines={1} // Truncate long names
            ellipsizeMode="tail" // Add ellipsis for overflow
          >
            {data?.name || 'Unknown'}
          </Text>
          {!isGroup && (
            <Text
              style={
                online
                  ? [styles.status, {color: Colors.secondary}]
                  : styles.status
              }>
              {online ? 'Online' : 'Offline'}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.innerContainer}>
        {/* <VectorIcon
          name="videocam"
          type="Ionicons"
          size={24}
          color={Colors.white}
        />
        <VectorIcon
          name="phone-alt"
          type="FontAwesome5"
          size={16}
          color={Colors.white}
          style={styles.iconStyle}
        /> */}
        <VectorIcon
          name="dots-three-vertical"
          type="Entypo"
          size={18}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Ensure full width
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, // Allow container to shrink if content is too wide
  },
  profilePhoto: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  textContainer: {
    flexShrink: 1, // Allow text container to shrink
    maxWidth: '60%', // Limit text container width to prevent overflow
  },
  username: {
    fontSize: 17,
    color: Colors.white,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: Colors.textGrey,
  },
  iconStyle: {
    marginHorizontal: 20, // Reduced slightly for better spacing
  },
});

export default ChatHeader;
