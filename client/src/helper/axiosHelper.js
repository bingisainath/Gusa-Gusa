import axios from 'axios';
import toast from 'react-hot-toast';

const axiosHelper = async (method, url, data = {}, options = {}) => {
  try {
    console.log(method, " : " ,url," : ", data);
    const response = await axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true, // Adjust as needed for cookies or credentials
      ...options // Spread options to allow additional configurations if needed
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error?.response?.data);
    toast.error(error?.response?.data?.message || 'An error occurred');
    throw error; // Rethrow the error for further handling if needed
  }
};

export default axiosHelper;
