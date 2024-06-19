const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

// Middleware function to authenticate requests using JWT
module.exports = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, SECRET_KEY);

     // Attach user data (email and userId) to the request object
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    
    // Call the next middleware function in the stack
    next();
  } catch (err) {
    // Return 401 Unauthorized if token verification fails
    res.status(401).json({ message: 'You are not authenticated!' });
  }
}