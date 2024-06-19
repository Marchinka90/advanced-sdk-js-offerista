import axiosInstance from './apiClient';

/**
 * Sends an authenticated HTTP request using Axios.
 * Ensures the user is authenticated before making the request.
 * @param {Auth} auth - An instance of the Auth class managing authentication.
 * @param {string} method - The HTTP method for the request (e.g., 'get', 'post', 'put', 'delete').
 * @param {string} url - The URL to which the request is sent.
 * @param {object|null} data - Optional data to send with the request (used in POST and PUT requests).
 * @returns {Promise<any>} A Promise that resolves to the response data from the server.
 * @throws {Error} If there is an error during the request or if the user fails to authenticate.
 */
export const requestWithAuth = async (auth, method, url, data = null) => {
    // Ensure the user is authenticated before proceeding
    await auth.ensureAuthenticated();

    // Configure the Axios request
    const config = {
        method: method,
        url: url,
        headers: {
            'Authorization': `Bearer ${auth.getAccessToken()}` // Attach the access token in the Authorization header
        },
        data: data // Include data for POST or PUT requests
    };

    try {
          // Send the request using the configured Axios instance
        const response = await axiosInstance(config);
        // Return the response data received from the server
        return response.data;
    } catch (error) {
        // Log an error message if the request fails
        console.error(`Error in ${method.toUpperCase()} request to ${url}:`, error);
        // Throw the error to be handled by the caller of this function
        throw error;
    }
};