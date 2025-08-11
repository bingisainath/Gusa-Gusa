import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // ⬅️ Install if not already: npm install moment
import {Colors} from '../../theme/Colors';
import {logout} from '../../redux/userSlice';
import LogManager from '../../helper/LogManager';
import NavigationManager from '../../helper/NavigationManager';
import ProfileDetailRow from '../../components/ProfileDetailRow';
import CustomModal from '../../components/CustomModal';
import VectorIcon from '../../utils/VectorIcon';

const ProfileScreen = props => {
  const {navigation} = props;
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState({
    name: false,
    gender: false,
    phone: false,
    dob: false,
    address: false,
    bio: false,
    avatar: false,
  });
  const [errors, setErrors] = useState({});

  const [name, setName] = useState(user?.name || 'No Data Available');
  const [email] = useState(user?.email || 'No Data Available');
  const [gender, setGender] = useState(user?.gender || 'Update your Gender');
  const [phone, setPhone] = useState(user?.phone || 'Update your Phone Number');
  const [dob, setDob] = useState(
    user?.DOB ? moment(user?.DOB).format('YYYY-MM-DD') : 'Update your DOB',
  );
  const [address, setAddress] = useState(user?.address || 'No Data Available');
  const [bio, setBio] = useState(user?.bio || 'Add your Bio');
  const [avatar, setAvatar] = useState(
    user?.profile_pic?.length > 0
      ? user.profile_pic
      : 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png',
  );
  const [socialIds, setSocialIds] = useState(
    user?.socialIds || {facebook: '', google: ''},
  );

  const getLastLoginText = () => {
    if (!user?.lastLogin) return '';

    const now = moment();
    const lastLogin = moment(user.lastLogin);

    const diffInMinutes = now.diff(lastLogin, 'minutes');
    const diffInHours = now.diff(lastLogin, 'hours');
    const diffInDays = now.diff(lastLogin, 'days');

    if (diffInMinutes < 60) {
      return `Last login ${diffInMinutes} minute${
        diffInMinutes !== 1 ? 's' : ''
      } ago`;
    } else if (diffInHours < 24) {
      return `Last login ${diffInHours} hour${
        diffInHours !== 1 ? 's' : ''
      } ago`;
    } else {
      return `Last login ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const handleLogout = () => {
    LogManager.info('Logout');
    dispatch(logout());
    AsyncStorage.clear();
    NavigationManager.navigateAndClear('Login');
  };

  const openModal = field => {
    setModalVisible({...modalVisible, [field]: true});
  };

  const closeModal = field => {
    setModalVisible({...modalVisible, [field]: false});
  };

  const fieldValueMap = {
    name: {value: name, setter: setName},
    gender: {value: gender, setter: setGender},
    phone: {value: phone, setter: setPhone},
    dob: {value: dob, setter: setDob},
    address: {value: address, setter: setAddress},
    bio: {value: bio, setter: setBio},
    avatar: {value: avatar, setter: setAvatar},
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => openModal('avatar')}>
            <Image source={{uri: avatar}} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.bioText}>{bio}</Text>
          <Text style={styles.lastLogin}>{getLastLoginText()}</Text>
        </View>

        <View style={styles.section}>
          <ProfileDetailRow
            iconName="user"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Name"
            value={name}
            onPress={() => openModal('name')}
          />

          <View style={styles.row}>
            <VectorIcon
              name="envelope"
              type="FontAwesome"
              size={25}
              color={Colors.primary}
              style={{width: 30}}
            />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          </View>

          <ProfileDetailRow
            iconName="phone"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Phone"
            value={phone}
            onPress={() => openModal('phone')}
          />

          <ProfileDetailRow
            iconName="venus-mars"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Gender"
            value={gender}
            onPress={() => openModal('gender')}
          />

          <ProfileDetailRow
            iconName="calendar"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Date of Birth"
            value={dob}
            onPress={() => openModal('dob')}
          />

          <ProfileDetailRow
            iconName="map-marker"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Address"
            value={address}
            onPress={() => openModal('address')}
          />

          <ProfileDetailRow
            iconName="info-circle"
            iconType="FontAwesome"
            iconColor={Colors.primary}
            label="Bio"
            value={bio}
            onPress={() => openModal('bio')}
          />
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <VectorIcon
            name="logout"
            type="MaterialCommunityIcons"
            size={25}
            color="#FF3B30"
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {Object.keys(modalVisible).map(field => (
        <CustomModal
          key={field}
          visible={modalVisible[field]}
          field={field}
          value={fieldValueMap[field].value}
          onChange={fieldValueMap[field].setter}
          onClose={() => closeModal(field)}
          errors={errors}
          setErrors={setErrors}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  bioText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  lastLogin: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
  },
});

export default ProfileScreen;
