const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
// Define the routes for user operations and map them to controller methods

// Route to get a user by their ID
router.get('/users/:id', UserController.getUserById);

// Route to create a new user
router.post('/users', UserController.createUser);

// Route to update multiple users in batch
router.put('/users/batch', UserController.updateUsersBatch);

// Route to update a user by their ID
router.put('/users/:id', UserController.updateUser);

// Route to get a list of users with optional pagination
router.get('/users', UserController.getUsers);

// Route to get multiple users in batch by their IDs
router.post('/users/batch', UserController.getUsersBatch);

// Route to delete multiple users in batch by their IDs
router.delete('/users/batch', UserController.deleteUsersBatch);

// Route to delete a user by their ID
router.delete('/users/:id', UserController.deleteUser);

module.exports = router