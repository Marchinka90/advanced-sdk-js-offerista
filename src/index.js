import { Auth } from './auth.js';
import { User } from './resources/user.js';

export class AdvancedSDK {
  /**
   * Initializes the SDK with authentication and user resources.
   * @param {string} email - User email for authentication.
   * @param {string} password - User password for authentication.
   * @param {string} apiBaseUrl - Base URL of the API.
   */
  constructor(email, password, apiBaseUrl) {
    // Construct the full URLs for authentication endpoints
    const tokenUrl = `${apiBaseUrl}/auth/token`;
    const refreshUrl = `${apiBaseUrl}/auth/refresh-token`;

    // Initialize the Auth instance for handling authentication
    this.auth = new Auth(email, password, tokenUrl, refreshUrl);

    // Initialize the User instance for interacting with user-related resources
    this.user = new User(this.auth, apiBaseUrl);
  }
}

