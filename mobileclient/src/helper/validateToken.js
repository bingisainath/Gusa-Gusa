import axios from 'axios';
import env from 'react-native-config';
import axiosHelper from './axiosHelper';

const validateToken = async token => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${env.LOCAL_IP_URL}/api/validate-token`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      // const response = await axiosHelper(config);
      console.log('Response:', response.data);
      const respData = {
        status: response.data.status,
        message: response.data,
      };
      return respData;
    } catch (error) {
      console.error('Token Error:', error);
      const errorData = {
        status: false,
        message: error,
      };
      return errorData;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    const errorData = {
      status: false,
      message: error,
    };
    return errorData;
  }
};

export default validateToken;
