import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create and configure an axios instance
const axiosInstance = axios.create();

// Configure axios-retry with the created axios instance
axiosRetry(axiosInstance, {
    retries: 3, // Number of retries before failing
    retryDelay: axiosRetry.exponentialDelay, // Exponential backoff delay between retries
    retryCondition: (error) => {
        // Define conditions under which to retry
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    }
});

export default axiosInstance;
