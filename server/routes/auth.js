const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

// Define the routes for authentication and refresh token operations and map them to controller methods

// Route to authenticate a user and obtain an access token and refresh token
router.post('/auth/token', AuthController.authentication);

// Route to refresh the access token using a refresh token
router.post('/auth/refresh-token', AuthController.refreshToken);

module.exports = router