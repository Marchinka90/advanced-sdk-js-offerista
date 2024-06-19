import { requestWithAuth } from '../util/requestWithAuth.js';
import { getCache, setCache } from '../util/cacheManager.js';

export class User {
  /**
   * Constructs a User instance.
   * @param {object} auth - Auth instance for handling authentication.
   * @param {string} apiBaseUrl - Base URL of the API.
   */
  constructor(auth, apiBaseUrl) {
    this.auth = auth;
    this.apiBaseUrl = apiBaseUrl;
    this.cacheTtl = 60000; // Cache time-to-live in milliseconds (e.g., 1 minutes)
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<object>} The user data.
   */
  async getUserById(userId) {
    const cacheKey = `users_${userId}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await requestWithAuth(this.auth, 'get', `${this.apiBaseUrl}/users/${userId}`);
    setCache(cacheKey, data, this.cacheTtl);
    return data;
  }

  /**
   * Creates a new user.
   * @param {object} userData - The data of the user to create.
   * @returns {Promise<object>} The created user data.
   */
  async createUser(userData) {
    return await requestWithAuth(this.auth, 'post', `${this.apiBaseUrl}/users`, userData);
  }

  /**
   * Updates an existing user.
   * @param {number} userId - The ID of the user to update.
   * @param {object} userData - The updated data of the user.
   * @returns {Promise<object>} The updated user data.
   */
  async updateUser(userId, userData) {
    return await requestWithAuth(this.auth, 'put', `${this.apiBaseUrl}/users/${userId}`, userData);
  }

  /**
   * Deletes a user by their ID.
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   */
  async deleteUser(userId) {
    return await requestWithAuth(this.auth, 'delete', `${this.apiBaseUrl}/users/${userId}`);
  }

  /**
   * Retrieves a list of users with optional pagination.
   * @param {string} page - The page number.
   * @param {string} limit - The number of users per page.
   * @returns {Promise<object>} The list of users.
   */
  async getUsers(page = '', limit = '') {
    let usersUrl = `${this.apiBaseUrl}/users`;
    if (page && limit) {
      usersUrl += `?page=${page}&limit=${limit}`;;
    }

    const cacheKey = page && limit ? `users_page_${page}_limit_${limit}` : 'users_all';
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await requestWithAuth(this.auth, 'get', usersUrl);
    setCache(cacheKey, data, this.cacheTtl);

    return data;
  }

  /**
   * Retrieves multiple users by their IDs in batch.
   * @param {Array<number>} userIds - Array of user IDs to retrieve.
   * @returns {Promise<object>} The batch of users.
   */
  async getUsersBatch(userIds) {
    const cacheKey = `users_${userIds}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const url = `${this.apiBaseUrl}/users/batch`;
    const data = await requestWithAuth(this.auth, 'post', url, { userIds });

    setCache(cacheKey, data, this.cacheTtl);

    return data;
  }

  /**
   * Deletes multiple users by their IDs in batch.
   * @param {Array<number>} userIds - Array of user IDs to delete.
   * @returns {Promise<void>} A promise that resolves when the users are deleted.
   */
  async deleteUsersBatch(userIds) {
    const url = `${this.apiBaseUrl}/users/batch`;
    return await requestWithAuth(this.auth, 'delete', url, { userIds });
  }

  /**
   * Updates multiple users in batch.
   * @param {Array<object>} usersToUpdate - Array of user objects with updated data.
   * @returns {Promise<object>} The updated batch of users.
   */
  async updateUsersBatch(usersToUpdate) {
    const url = `${this.apiBaseUrl}/users/batch`;
    return await requestWithAuth(this.auth, 'put', url, { usersToUpdate });
  }
}
