import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from 'react-native-config';

const fetchUserDetails = async () => {
  //   const dispatch = useDispatch();
  //   const navigation = useNavigation();

  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    console.log('================ fetch ser token ====================');
    console.log(token);
    console.log('====================================');

    if (!token) {
      const respObj = {
        status: false,
        error: error,
      };
      //   console.log(' ========= No token is available ');
      //   navigation.replace('Login');
      return respObj; // Stop execution if no token is found
    }

    const URL = `${env.LOCAL_IP_URL}/api/user-details`;

    // Make the API call with the token in the Authorization header
    const response = await axios({
      url: URL,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // This won't work the same as in web apps, but leaving it in case it's useful
    });

    console.log('response:', response.data);

    const respObj = {
      status: true,
      data: response.data,
    };

    return respObj;
  } catch (error) {
    console.log('Error fetching user details:', error);
    const respObj = {
      status: false,
      error: error,
    };
    return respObj;
  }
};

export default fetchUserDetails;
