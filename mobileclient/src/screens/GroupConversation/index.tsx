import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import ChatList from '../../components/ChatList';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../theme/Colors';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
// import Toast from 'react-native-toast-message';
import env from 'react-native-config';
import axiosHelper from '../../helper/axiosHelper';
import {useToast} from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationManager from '../../helper/NavigationManager';

const GroupConversation = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const {socketConnection, user, AllGroups} = useSelector(state => state?.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Automatically add current user when modal opens
  useEffect(() => {
    if (modalVisible && user) {
      setSelectedUsers([
        {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
        },
      ]);
    }
  }, [modalVisible, user]);

  // Handle user search
  const handleSearchUser = async () => {
    try {
      const response = await axiosHelper(
        'post',
        `${env.LOCAL_IP_URL}/api/search-user`,
        {search},
      );
      setLoading(true);
      setSearchUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      toast.show(error?.response?.data?.message || 'Failed to search users', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      handleSearchUser();
    } else {
      setSearchUsers([]);
    }
  }, [search]);

  // Handle user selection
  const handleSelectUser = user => {
    const userExists = selectedUsers.find(
      selectedUser => selectedUser.userId === user._id,
    );

    if (userExists) {
      // if (user._id === user._id) {
      //   toast.show('Cannot remove yourself from the group', {
      //     type: 'danger',
      //     placement: 'bottom',
      //     duration: 4000,
      //     offset: 30,
      //     animationType: 'slide-in',
      //   });
      //   return;
      // }
      setSelectedUsers(
        selectedUsers.filter(selectedUser => selectedUser.userId !== user._id),
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        {userId: user._id, userName: user.name, userEmail: user.email},
      ]);
    }
  };

  // Handle removing a user
  // const handleRemoveUser = userId => {
  //   if (userId === user._id) {
  //     // Toast.show({
  //     //   type: 'error',
  //     //   text1: 'Cannot remove yourself from the group',
  //     // });
  //     toast.show('Cannot remove yourself from the group', {
  //       type: 'danger',
  //       placement: 'bottom',
  //       duration: 4000,
  //       offset: 30,
  //       animationType: 'slide-in',
  //     });
  //     return;
  //   }
  //   setSelectedUsers(
  //     selectedUsers.filter(selectedUser => selectedUser.userId !== userId),
  //   );
  // };

  // Handle group creation
  const handleCreateGroup = async () => {
    try {
      console.log('========== groupName ==========');
      console.log(groupName);
      console.log('====================================');

      if (!groupName) {
        toast.show('Group name is required', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        });
        return;
      }
      if (selectedUsers.length === 0) {
        toast.show('At least one user must be selected', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        });
        return;
      }

      setLoading(true);
      const groupData = {
        groupName,
        groupProfilePic: '',
        participants: selectedUsers,
      };

      console.log('============== data ==========');
      console.log(groupData);
      console.log('====================================');

      const token = await AsyncStorage.getItem('token');

      const response = await axiosHelper(
        'post',
        `${env.LOCAL_IP_URL}/api/create-group`,
        {
          groupName,
          groupProfilePic: '',
          participants: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
        },
      );

      console.log('=========== create group res =======');
      console.log(response);
      console.log('====================================');

      if (response.success) {
        NavigationManager.navigate('Chat', {
          isGroup: true,
          groupId: response._id,
          contactId: response._id,
          userId: user._id,
          groupData: response.data,
        });

        toast.show('Group Created Successfully', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        });
// WH
//           offset: 30,
//           animationType: 'slide-in',
//         });

        setModalVisible(false);
        setGroupName('');
        setSearch('');
        setSearchUsers([]);
        setSelectedUsers([
          {userId: user._id, userName: user.name, userEmail: user.email},
        ]);
      } else {
        toast.show(response?.error || 'Failed to create group', {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in',
        });
      }
    } catch (error) {
      setLoading(false);
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: error?.response?.data?.message || 'Failed to create group',
      // });

      toast.show(error?.response?.data?.message || 'Failed to create group', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in',
      });
    }
  };

  const renderUserItem = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}>
      <Text style={styles.userText}>
        {item.name} ({item.email})
      </Text>
      <View style={styles.checkbox}>
        {selectedUsers.some(
          selectedUser => selectedUser.userId === item._id,
        ) && (
          <VectorIcon
            name="check"
            type="MaterialCommunityIcons"
            size={20}
            color={Colors.primary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  // const renderSelectedUser = ({item}) => (
  //   <View style={styles.selectedUserItem}>
  //     <Text style={styles.selectedUserText}>
  //       {item.userName} ({item.userEmail})
  //     </Text>
  //     {item.userId !== user._id && (
  //       <TouchableOpacity onPress={() => handleRemoveUser(item.userId)}>
  //         <VectorIcon
  //           name="close"
  //           type="MaterialCommunityIcons"
  //           size={20}
  //           color={Colors.primary}
  //         />
  //       </TouchableOpacity>
  //     )}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={user?._id} data={AllGroups} isGroup />
      </ScrollView>
      <TouchableOpacity
        style={styles.contactIcon}
        onPress={() => setModalVisible(true)}>
        <VectorIcon
          name="account-group"
          type="MaterialCommunityIcons"
          size={22}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Group Name Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Group name..."
                  placeholderTextColor="#999"
                  value={groupName}
                  onChangeText={setGroupName}
                />

                {/* Search User Input */}
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search user by name, email..."
                    placeholderTextColor="#999"
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

                {/* Selected Users */}
                {/* {selectedUsers.length > 0 && (
                  <View style={styles.selectedUsersContainer}>
                    <Text style={styles.selectedUsersTitle}>
                      Selected Users:
                    </Text>
                    <FlatList
                      data={selectedUsers}
                      renderItem={renderSelectedUser}
                      keyExtractor={item => item.userId}
                      style={styles.selectedUserList}
                    />
                  </View>
                )} */}

                {/* Search Results */}
                <View style={styles.searchResults}>
                  {loading && (
                    <ActivityIndicator size="large" color={Colors.primary} />
                  )}
                  {!loading && searchUsers.length === 0 && search && (
                    <Text style={styles.noUserText}>No user found!</Text>
                  )}
                  {!loading && searchUsers.length > 0 && (
                    <FlatList
                      data={searchUsers}
                      renderItem={renderUserItem}
                      keyExtractor={item => item._id}
                      style={styles.userList}
                    />
                  )}
                </View>

                {/* Create Group Button */}
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateGroup}
                  disabled={loading}>
                  <Text style={styles.createButtonText}>Create Group</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <VectorIcon
                    name="close"
                    type="MaterialCommunityIcons"
                    size={30}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.darkBackground,
    flex: 1,
    paddingBottom: 5,
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    padding: 10,
  },
  selectedUsersContainer: {
    marginBottom: 10,
  },
  selectedUsersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  selectedUserList: {
    maxHeight: 100,
  },
  selectedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedUserText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchResults: {
    maxHeight: '40%',
    marginBottom: 10,
  },
  noUserText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  userList: {
    flexGrow: 0,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: Colors.primary,
  },
});

export default GroupConversation;
