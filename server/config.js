const config = {
  SECRET_KEY: 'some_secret_key',  // Replace with your secret key
  ACCESS_TOKEN_EXPIRY: 1800, // Access token expires in 30 minutes
  REFRESH_TOKEN_EXPIRY: 604800, // Refresh token expires in 7 days
  SALT_ROUNDS: 10 
};

module.exports = config;