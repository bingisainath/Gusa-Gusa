import axios from 'axios';

const axiosHelper = async (method, url, data = {}, options = {}) => {
  try {
    console.log('Request Method:', method);
    console.log('Request URL:', url);
    console.log('Request Data:', data);

    const response = await axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true, // Adjust as needed for cookies or credentials
      ...options, // Spread options to allow additional configurations if needed
    });

    // console.log('Response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Response Error:', error.response);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    throw error; // Rethrow the error for further handling if needed
  }
};

export default axiosHelper;
