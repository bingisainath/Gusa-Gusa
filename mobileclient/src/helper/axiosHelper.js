import axios from 'axios';

const axiosHelper = async (method, url, data = {}, options = {}) => {
  const MAX_RETRIES = 3;
  const TIMEOUT = 8000; // 10 seconds timeout
  const RETRY_DELAY = 1000; // 1 second delay between retries

  // Default configuration
  const defaultOptions = {
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log('========== defaultOptions =========');
  console.log(defaultOptions);
  console.log('====================================');

  // Create axios instance with defaults
  const axiosInstance = axios.create(defaultOptions);

  // Retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Attempt ${attempt} - Request Method: ${method}, URL: ${url}`,
      );
      console.log(`Request Data:`, JSON.stringify(data, null, 2));

      const response = await axiosInstance({
        method,
        url,
        data,
      });

      console.log(`Request Success - Status: ${response.status}`);
      return response.data;
    } catch (error) {
      const errorDetails = {
        attempt,
        method,
        url,
        timestamp: new Date().toISOString(),
      };

      if (error.response) {
        // Server responded with a status code outside 2xx
        errorDetails.status = error.response.status;
        errorDetails.data = error.response.data;
        console.error('Response Error:', JSON.stringify(errorDetails, null, 2));

        // Don't retry for 4xx errors (client errors)
        if (error.response.status >= 400 && error.response.status < 500) {
          return {
            error: true,
            status: error.response.status,
            message: error.response.data?.message || 'Client error',
            data: error.response.data,
          };
        }
      } else if (error.request) {
        // No response received
        errorDetails.errorType = 'No response';
        console.error('Request Error:', JSON.stringify(errorDetails, null, 2));
      } else {
        // Other errors (network, setup, etc.)
        errorDetails.message = error.message;
        console.error('General Error:', JSON.stringify(errorDetails, null, 2));
      }

      // Handle retries
      if (attempt < MAX_RETRIES) {
        console.log(
          `Retrying (${attempt + 1}/${MAX_RETRIES}) after ${RETRY_DELAY}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }

      // Return structured error response after max retries
      return {
        error: true,
        message:
          error.response?.data?.message ||
          error.message ||
          'Request failed after retries',
        status: error.response?.status || null,
        details: errorDetails,
      };
    }
  }
};

export default axiosHelper;
