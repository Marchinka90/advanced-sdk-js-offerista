import axiosInstance from './util/apiClient';

export class Auth {
  /**
   * Constructor for Auth class.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @param {string} tokenUrl - URL to authenticate and get tokens.
   * @param {string} refreshUrl - URL to refresh access token.
   */
  constructor(email, password, tokenUrl, refreshUrl) {
    this.email = email;
    this.password = password;
    this.tokenUrl = tokenUrl;
    this.refreshUrl = refreshUrl;
    this.accessToken = this.loadAccessToken(); // Load access token from localStorage
    this.accessTokenExpiry = this.loadAccessTokenExpiry(); // Load access token expiry time from localStorage
    this.refreshToken = this.loadRefreshToken(); // Load refresh token from localStorage
  }

  /**
   * Loads access token from localStorage.
   * @returns {string|null} Access token.
   */
  loadAccessToken() {
    return localStorage.getItem('accessToken');
  }

  /**
  * Saves access token to localStorage.
  * @param {string} token - Access token to save.
  */
  saveAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Loads access token expiry time from localStorage.
   * @returns {number|null} Access token expiry time (timestamp).
   */
  loadAccessTokenExpiry() {
    return parseInt(localStorage.getItem('tokenExpiry'), 10);
  }

  /**
   * Saves access token expiry time to localStorage.
   * @param {number} expiry - Access token expiry time (timestamp).
   */
  saveAccessTokenExpiry(expiry) {
    localStorage.setItem('tokenExpiry', expiry);
  }

  /**
   * Loads refresh token from localStorage.
   * @returns {string|null} Refresh token.
   */
  loadRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Saves refresh token to localStorage.
   * @param {string} token - Refresh token to save.
   */
  saveRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
  }

  /**
   * Authenticates user and retrieves access and refresh tokens.
   */
  async authenticate() {
    const config = {
      method: 'post',
      url: this.tokenUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: this.email,
        password: this.password
      }
    };

    try {
      const { data } = await axiosInstance(config);
      const { accessToken, expiresIn, refreshToken } = data;

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.accessTokenExpiry = expiresIn;

      this.saveAccessToken(this.accessToken);
      this.saveAccessTokenExpiry(this.accessTokenExpiry);
      this.saveRefreshToken(this.refreshToken);
    } catch (error) {
      console.error('Error authenticating:', error);
      throw error;
    }
  }

  /**
   * Refreshes access token using refresh token.
   */
  async refreshAccessToken() {
    const config = {
      method: 'post',
      url: this.refreshUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        refreshToken: this.refreshToken
      }
    };

    try {
      const { data } = await axiosInstance(config);
      const { accessToken, expiresIn } = data;

      this.accessToken = accessToken;
      this.accessTokenExpiry = expiresIn;

      this.saveAccessToken(this.accessToken);
      this.saveAccessTokenExpiry(this.accessTokenExpiry);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
  * Ensures user is authenticated by checking access token validity.
  * If access token is invalid or expired, attempts to refresh it using refresh token.
  * If no refresh token is available or refresh fails, falls back to re-authenticating.
  */
  async ensureAuthenticated() {
    if (!this.accessToken || Date.now() >= this.accessTokenExpiry) {
      try {
        if (this.refreshToken) {
          await this.refreshAccessToken(); // Refresh access token if refresh token exists
        } else {
          await this.authenticate(); // Authenticate if no refresh token is available
        }
      } catch (error) {
        await this.authenticate(); // Fallback to authenticate in case of any error
      }
    }
  }

  /**
  * Retrieves the current access token.
  * @returns {string|null} Current access token.
  */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Retrieves the current refresh token.
   * @returns {string|null} Current refresh token.
   */
  getRefreshToken() {
    return this.refreshToken;
  }
}
