import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../theme/Colors';
import ChatList from '../../components/ChatList';
import Toast from 'react-native-toast-message';
import env from 'react-native-config';
import axiosHelper from '../../helper/axiosHelper';
import NavigationManager from '../../helper/NavigationManager';

const OneToOneConversation = () => {
  const navigation = useNavigation();
  const {socketConnection, user, AllUser} = useSelector(state => state?.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchUser = async () => {
    try {
      setLoading(true);
      const response = await axiosHelper(
        'post',
        `${env.LOCAL_IP_URL}/api/search-user`,
        {search},
      );
      setSearchUser(response?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to search users',
      });
    }
  };

  useEffect(() => {
    if (search) {
      handleSearchUser();
    } else {
      setSearchUser([]);
    }
  }, [search]);

  const handleUserSelect = selectedUser => {
    setModalVisible(false);
    setSearch('');
    setSearchUser([]);
    NavigationManager.navigate('Chat', {
      isGroup: false,
      contactId: '',
      userId: selectedUser._id,
      userData: selectedUser,
    });
  };

  const renderUserItem = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item)}>
      <Text style={styles.userName}>{item.name || item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={user?._id} data={AllUser} isGroup={false} />
      </ScrollView>
      <TouchableOpacity
        style={styles.contactIcon}
        onPress={() => setModalVisible(true)}>
        <VectorIcon
          name="message-reply-text"
          type="MaterialCommunityIcons"
          size={22}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Search Input */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search user by name, email..."
                  placeholderTextColor={Colors.primary}
                  value={search}
                  onChangeText={setSearch}
                />
                <VectorIcon
                  name="magnify"
                  type="MaterialCommunityIcons"
                  size={25}
                  color={Colors.primary}
                  style={styles.searchIcon}
                />
              </View>

              {/* Search Results */}
              <View style={styles.resultsContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={Colors.primary} />
                ) : searchUser.length === 0 && search ? (
                  <Text style={styles.noUserText}>No user found!</Text>
                ) : (
                  <FlatList
                    data={searchUser}
                    renderItem={renderUserItem}
                    keyExtractor={item => item._id}
                    style={styles.userList}
                  />
                )}
              </View>

              {/* Close Button */}
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <VectorIcon
                  name="close"
                  type="MaterialCommunityIcons"
                  size={30}
                  color={Colors.primary}
                />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.darkBackground,
    flex: 1,
    paddingTop: 5,
  },
  contactIcon: {
    backgroundColor: Colors.secondary,
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: '70%',
    minHeight: '40%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 40,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.black,
  },
  searchIcon: {
    marginLeft: 10,
  },
  resultsContainer: {
    marginTop: 10,
    flex: 1,
    padding: 10,
  },
  userList: {
    flexGrow: 0,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  userName: {
    fontSize: 16,
    color: Colors.black,
  },
  noUserText: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: Colors.primary,
  },
});

export default OneToOneConversation;
