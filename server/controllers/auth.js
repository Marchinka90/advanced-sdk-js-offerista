const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importing configuration values
const { SECRET_KEY, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../config');

// Load users from the database (db.json) and initialize refresh tokens storage
let users = require('../db.json').users;
let refreshTokens = {};

// API Endpoint for user authentication
exports.authentication = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    // If user not found, send a 401 response
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  try {
    // Compare provided password with stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // If there is no match, send a 401 response
      return res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    // Handle any errors that occur during password comparison
    return res.status(500).json({ message: 'Internal server error' });
  }

  // Generate access and refresh tokens for the authenticated user
  const accessToken = generateAccessToken(email);
  const refreshToken = generateRefreshToken(email);

  // Store the refresh token with its expiry time
  refreshTokens[refreshToken] = {
    email,
    expiresIn: Date.now() + REFRESH_TOKEN_EXPIRY * 1000
  };

  // Send the tokens and expiry time back to the client
  return res.status(200).json({
    accessToken,
    refreshToken,
    expiresIn: Date.now() + ACCESS_TOKEN_EXPIRY * 1000
  });
}

// API Endpoint for refreshing the access token using a refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  // Check if the refresh token is valid and exists in the storage
  if (!refreshToken && !refreshTokens[refreshToken]) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const { email, expiresIn } = refreshTokens[refreshToken];

 // Check if the refresh token has expired
  if (Date.now() > expiresIn) {
    delete refreshTokens[refreshToken];
    return res.status(401).json({ message: 'Refresh token expired' });
  }

  // Generate a new access token
  const accessToken = generateAccessToken(email);

  // Send the new access token and its expiry time back to the client
  res.status(200).json({
    accessToken,
    expiresIn: Date.now() + ACCESS_TOKEN_EXPIRY * 1000
  });
}

// Generate an access token
const generateAccessToken = (email) => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: Date.now() + ACCESS_TOKEN_EXPIRY * 1000 });
};

// Generate a refresh token
const generateRefreshToken = (email) => {
  const refreshToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: Date.now() + REFRESH_TOKEN_EXPIRY * 1000 });
  refreshTokens[refreshToken] = email;
  return refreshToken;
};