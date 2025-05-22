import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import {useNavigation} from '@react-navigation/native';
import {getImage} from '../utils/helper';
import {ChatListData} from '../data/ChatListData';

const ChatList = ({userId}) => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);

  const onNavigate = contactId => {
    navigation.navigate('Chat', {
      contactId: contactId,
      userId: userId,
    });
  };

  return (
    <>
      {ChatListData.map(item => (
        <View key={item?.id}>
          <TouchableOpacity
            onPress={onNavigate}
            style={styles.container}>
            <View style={styles.leftContainer}>
              {item?.profile && (
                <Image
                  source={{uri: item?.profile}}
                  style={styles.profileImg}
                />
              )}
              <View>
                <Text style={styles.username}>{item?.name}</Text>
                <Text style={styles.message}>{item?.lastMessage?.body}</Text>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <Text style={styles.timeStamp}>
                {item?.lastMessage?.timestamp}
              </Text>
              {item?.mute && (
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="volume-variant-off"
                  size={22}
                  color={Colors.textGrey}
                  style={styles.muteIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 50,
    height: 40,
    width: 40,
    marginRight: 15,
  },
  container: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 0.5,
    borderColor: Colors.textGrey,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: Colors.textColor,
    fontSize: 16,
  },
  message: {
    color: Colors.textGrey,
    fontSize: 14,
    marginTop: 5,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  timeStamp: {
    color: Colors.textGrey,
    fontSize: 12,
  },
  muteIcon: {
    marginTop: 5,
    marginLeft: 20,
  },
});

export default ChatList;
