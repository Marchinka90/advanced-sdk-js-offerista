import { AdvancedSDK } from '../src/index.js';

// When the document has fully loaded, set up the event listeners for the form and buttons
document.addEventListener('DOMContentLoaded', () => {
  // Grab references to the HTML elements that will be interacted with
  const form = document.getElementById('authForm');
  const refreshBtn = document.getElementById('refreshBtn');
  const getUserBtn = document.getElementById('getUserBtn');
  const createUserBtn = document.getElementById('createUserBtn');
  const updateUserBtn = document.getElementById('updateUserBtn');
  const deleteUserBtn = document.getElementById('deleteUserBtn');
  const getUsersBtn = document.getElementById('getUsersBtn');
  const getUsersBatchBtn = document.getElementById('getUsersBatchBtn');
  const deleteUsersBatchBtn = document.getElementById('deleteUsersBatchBtn');
  const updateUsersBatchBtn = document.getElementById('updateUsersBatchBtn');
  const authOutput = document.getElementById('authOutput');
  const crudOutput = document.getElementById('crudOutput');
  const getUsersOutput = document.getElementById('getUsersOutput');
  const batchOutput = document.getElementById('batchOutput');

  // Hide output sections initially
  authOutput.style.display = 'none';
  crudOutput.style.display = 'none';
  getUsersOutput.style.display = 'none';
  batchOutput.style.display = 'none';

  let sdk;

  // Event listener for form submission to handle authentication
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const baseUrl = form.baseUrl.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      // Initialize the SDK with the provided credentials and base URL
      sdk = new AdvancedSDK(email, password, baseUrl);

      // Perform authentication
      await sdk.auth.authenticate();
      // Display success message and enable buttons
      authOutput.style.display = 'block';
      authOutput.textContent = `Authentication successful! Access token: ${sdk.auth.getAccessToken()}`;
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.classList.remove('disabled');
        button.disabled = false;
      });
    } catch (error) {
       // Display error message if authentication fails
      authOutput.style.display = 'block';
      authOutput.textContent = `Authentication failed: ${error.message}`;
    }
  });

  // Event listener for refreshing the access token
  refreshBtn.addEventListener('click', async () => {
    try {
      await sdk.auth.refreshAccessToken();
      authOutput.style.display = 'block';
      authOutput.textContent = `Token refreshed successfully! Access token: ${sdk.auth.getAccessToken()}`;
    } catch (error) {
      authOutput.style.display = 'block';
      authOutput.textContent = `Token refresh failed: ${error.message}`;
    }
  });

  // Event listener for fetching a user by ID
  getUserBtn.addEventListener('click', async () => {
    const userId = document.getElementById('userId').value;
    try {
      const response = await sdk.user.getUserById(userId);
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Fetched user successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Failed to fetch user: ${error.message}`;
    }
  });

  // Event listener for creating a new user
  createUserBtn.addEventListener('click', async () => {
    const newUser = JSON.parse(document.getElementById('newUser').value);
    try {
      const user = await sdk.user.createUser(newUser);
      crudOutput.style.display = 'block';
      crudOutput.textContent = 'Created user: ' + JSON.stringify(user);
    } catch (error) {
      crudOutput.style.display = 'block';
      crudOutput.textContent = 'Failed to create user: ' + error.message;
    }
  });

  // Event listener for updating a user
  updateUserBtn.addEventListener('click', async () => {
    const updateUser = JSON.parse(document.getElementById('updateUser').value);
    try {
      const response = await sdk.user.updateUser(updateUser.id, updateUser);
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Updated user successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Failed to update user: ${error.message}`;
    }
  });

  // Event listener for deleting a user
  deleteUserBtn.addEventListener('click', async () => {
    const userId = document.getElementById('deleteUserId').value;
    try {
      const response = await sdk.user.deleteUser(userId);
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Deleted user successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      crudOutput.style.display = 'block';
      crudOutput.textContent = `Failed to delete user: ${error.message}`;
    }
  });

  // Event listener for fetching users with pagination
  getUsersBtn.addEventListener('click', async () => {
    const page = document.getElementById('pageInput').value;
    const limit = document.getElementById('limitInput').value;

    try {
      const response = await sdk.user.getUsers(page, limit);
      getUsersOutput.style.display = 'block';
      getUsersOutput.textContent = `Fetched users successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      getUsersOutput.style.display = 'block';
      getUsersOutput.textContent = `Failed to fetch users: ${error.message}`;
    }
  });

  // Event listener for fetching multiple users by their IDs in a batch
  getUsersBatchBtn.addEventListener('click', async () => {
    const batchUserIds = document.getElementById('batchUserIds').value;

    try {
      const response = await sdk.user.getUsersBatch(batchUserIds);
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Fetched users successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Failed to fetch users: ${error.message}`;
    }
  });

  // Event listener for deleting multiple users by their IDs in a batch
  deleteUsersBatchBtn.addEventListener('click', async () => {
    const batchUserIds = document.getElementById('batchUserIds').value;

    try {
      const response = await sdk.user.deleteUsersBatch(batchUserIds);
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Deleted users successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Failed to delete users: ${error.message}`;
    }
  });

  // Event listener for updating multiple users in a batch
  updateUsersBatchBtn.addEventListener('click', async () => {
    const batchUpdateUsersData = document.getElementById('batchUpdateUsersData').value;
    const usersToUpdate = JSON.parse(batchUpdateUsersData);
    console.log(usersToUpdate)
    try {
      const response = await sdk.user.updateUsersBatch(usersToUpdate);
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Updated users successfully: ${JSON.stringify(response)}`;
    } catch (error) {
      batchOutput.style.display = 'block';
      batchOutput.textContent = `Failed to update users: ${error.message}`;
    }
  });
});
