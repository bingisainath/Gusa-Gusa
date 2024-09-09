import axios from 'axios';
import env from 'react-native-config';

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

    console.log('============== Config  ======================');
    console.log(config);
    console.log('====================================');

    try {
      const response = await axios.request(config);
      console.log('Response:', response.data);
      const respData = {
        status: true,
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
    return null;
  }
};

export default validateToken;
