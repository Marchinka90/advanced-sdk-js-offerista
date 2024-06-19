const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../config');

let users = require('../db.json').users;

// API endpoint to get a user by ID
exports.getUserById = (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    delete user.password;  // Remove password before sending user data
    return res.status(200).json({ message: 'Fetched user successfully', user });
  }
  return res.status(404).json({ message: 'User not found' });
}

// API endpoint to create a new user
exports.createUser = async (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name || !phone) {
    // Return 400 if any input is missing
    return res.status(404).json({ message: 'All inputs are required' });
  }

  const user = users.find(u => u.email == email);

  if (user) {
    // Return 409 if user already exists
    return res.status(409).json({ message: 'User is already registered' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    // Generate new user ID
    const id = String(parseInt(users[users.length - 1].id) + 1);
    const newUser = {
      id,
      email,
      name,
      password: hashedPassword, // Store hashed password
      phone
    }
    // Add new user to users array
    users.push(newUser);
    return res.status(201).json({ message: 'User is registered successfully', data: newUser });
  } catch (error) {
    // Return 500 if there is a server error
    return res.status(500).json({ message: 'Internal server error' });
  }
}
// API endpoint to update a user by ID
exports.updateUser = async (req, res) => {
  // Prevent modification of user with ID 1 (test user)
  if (req.params.id == 1) {
    return res.status(401).json({ message: 'This user can not be modified' })
  }

  // Find user by ID
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    // Return 404 if user not found
    return res.status(404).json({ message: 'User is not found' });
  }

  const { email, name, phone } = req.body;

  if (!email || !name || !phone) {
    // Return 400 if any input is missing
    return res.status(404).json({ message: 'All inputs are required' });
  }
  // Update user details
  Object.assign(user, { email, name, phone });
  return res.status(200).json({ message: 'User is updated successfully', data: user });
}

// API endpoint to delete a user by ID
exports.deleteUser = async (req, res, next) => {
  // Prevent modification of user with ID 1 (test user)
  if (req.params.id == 1) {
    return res.status(401).json({ message: 'This user can not be modified' })
  }
  // Find user index by ID
  const index = users.findIndex(u => u.id == req.params.id);

  if (index !== -1) {
    // Remove user from users array
    users.splice(index, 1);
    return res.status(200).json({ message: 'User is deleted successfully' });
  }
   // Return 404 if user not found
  return res.status(404).json({ message: 'User not found' });
}

// API endpoint to get all users with optional pagination
exports.getUsers = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && limit) {
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedUsers = users.slice(start, end);
    // Remove passwords from users
    paginatedUsers.map(u => deletePassword(u));
    const total = users.length;
    return res.status(200).json({
      message: 'Fetched Pagination users successfully',
      page,
      limit,
      total,
      users: paginatedUsers
    });
  }
  // Remove passwords from all users
  users.map(u => deletePassword(u))

  return res.status(200).json({ message: 'Fetched List users successfully', users });
}

// API endpoint to get multiple users by their IDs
exports.getUsersBatch = (req, res, next) => {
  const { userIds } = req.body;
  // Clean the user IDs string
  const cleanedStr = String(userIds).replace(/,\s*$/, '');
  const userIdsArr = cleanedStr.split(',').map(id => {
    if (id) { return id.trim() }
  });

  // Find users by IDs
  const fetchedUsers = users.filter(user => userIdsArr.includes(user.id));
  // Remove passwords from users
  fetchedUsers.map(u => deletePassword(u))
  return res.status(200).json({ message: 'Fetched multiple users by IDs successfully', fetchedUsers });
}

// API endpoint to update multiple users by their IDs
exports.updateUsersBatch = (req, res, next) => {
  const { usersToUpdate } = req.body;

  usersToUpdate.forEach(userForUpdate => {
    const index = users.findIndex(user => user.id === userForUpdate.id);
    if (index !== -1 && index !== '1') {
      // Update user details
      users[index] = { ...users[index], ...userForUpdate }; 
    }
  });

  res.status(200).json({ message: 'Users updated successfully' });
}

// API endpoint to delete multiple users by their IDs
exports.deleteUsersBatch = (req, res, next) => {
  const { userIds } = req.body;
  // Clean the user IDs string
  const cleanedStr = String(userIds).replace(/,\s*$/, '');
  const userIdsArr = cleanedStr.split(',').map(id => {
    if (id) { return id.trim() }
  });

  userIdsArr.forEach(id => {
    if (users[id] && id !== '1') {
      // Delete users
      delete users[id];
    }
  });
  res.status(200).json({ message: 'Users deleted successfully' });
}

// Helper function to remove password from user object
const deletePassword = (user) => {
  delete user.password;
  return user
}