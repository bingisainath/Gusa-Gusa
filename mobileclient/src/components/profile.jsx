import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import VectorIcon from '../utils/VectorIcon';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../theme/Colors';

// import {logoutRequest} from '../../redux/actions';
// import {baseLocalEng} from '../../utils/baseLocalization';
// import {style} from './style';

const ProfileScreen = (props: any) => {
  const {navigation, route} = props;
  const [avatar, setAvatar] = useState(
    'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png',
  );

  //   const user = auth().currentUser;
  //   const userData = useSelector((state: any) => state.userData);
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     setName(userData?.name);
  //     setEmergencyPhone(userData?.emergencyContactNumber);
  //   }, [userData]);

  // Dummy Data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    phoneNumber: '+1234567890',
    emergencyContactNumber: '+0987654321',
  };

  const [name, setName] = useState(userData?.name);
  const [email, setEmail] = useState(userData?.email);
  const [gender, setGender] = useState(userData?.gender);
  const [phone, setPhone] = useState(userData?.phoneNumber);
  const [emergencyPhone, setEmergencyPhone] = useState(
    userData?.emergencyContactNumber,
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/474x/1b/d7/8d/1bd78daab0bd76b6352dcefceb72c6ca.jpg',
      }}
      style={style.image1}>
      <View style={style.mainContainer}>
        <View style={style.profileHeader}>
          <Image style={style.image} source={{uri: avatar}} />
        </View>
        <View style={style.subContainer}>
          <View style={style.subContainer1}>
            <View style={style.profileBody}>
              <VectorIcon
                name="user"
                type="FontAwesome"
                size={30}
                color={Colors.primary}
                style={style.icon}
              />
              <View style={style.profileSubBody}>
                <Text style={style.profileText}>name</Text>
                <Text style={style.textColorStyle}>{name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('UpdateName')}>
              <VectorIcon
                name="angle-right"
                type="FontAwesome"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={style.profileBody}>
            <VectorIcon
              name="envelope"
              type="FontAwesome"
              size={25}
              color={Colors.primary}
              style={style.icon}
            />
            <View style={style.profileSubBody}>
              <Text style={style.profileText}>email</Text>
              <Text style={style.textColorStyle}>{email}</Text>
            </View>
          </View>

          <View style={style.profileBody}>
            <VectorIcon
              name="venus-mars"
              type="FontAwesome"
              size={25}
              color={Colors.primary}
              style={style.icon}
            />
            <View style={style.profileSubBody}>
              <Text style={style.profileText}>gender</Text>
              <Text style={style.textColorStyle}>{gender}</Text>
            </View>
          </View>

          <View style={style.profileBody}>
            <VectorIcon
              name="phone"
              type="FontAwesome"
              size={30}
              color={Colors.primary}
              style={style.icon}
            />
            <View style={style.profileSubBody}>
              <Text style={style.profileText}>phoneNumber</Text>
              <Text style={style.textColorStyle}>{phone}</Text>
            </View>
          </View>

          <View style={style.subContainer1}>
            <View style={style.profileBody}>
              <VectorIcon
                name="mobile"
                type="FontAwesome"
                size={40}
                color={Colors.primary}
                style={style.icon}
              />
              <View style={style.profileSubBody}>
                <Text style={style.profileText}>emergencyContactNumber</Text>
                <Text style={style.textColorStyle}>{emergencyPhone}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('UpdateEmergencyNumber')}>
              <VectorIcon
                name="angle-right"
                type="FontAwesome"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <View style={style.profileBody}>
              <VectorIcon
                name="logout"
                type="MaterialCommunityIcons"
                size={30}
                color={Colors.primary}
                style={style.icon}
              />
              <View style={style.profileSubBody}>
                <Text style={style.profileText}>logout</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: theme.backgroundColor,
    justifyContent: 'center',
  },
  image1: {
    flex: 1,
    resizeMode: 'cover',
    // width: screenWidth,
    // height: screenHeight,
  },
  icon: {
    padding: 5,
  },
  profileHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    borderColor: '#000000',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  profilePictureText: {
    color: '#000',
  },
  profileText: {
    color: '#000',
    fontSize: 16,
  },
  subContainer: {
    paddingHorizontal: 20,
  },
  subContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBody: {
    // backgroundColor: theme.backgroundColor,
    fontSize: 12,
    color: '#808e9b',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSubBody: {
    marginLeft: 10,
  },
  iconStyle: {
    paddingTop: 8,
  },
  textColorStyle: {
    color: '#000',
  },
});
