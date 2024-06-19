const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();
const port = 5000;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json())

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:8080', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionSuccessStatus: 200 // Response status for successful OPTIONS requests
}
app.use(cors(corsOptions));

// simulate network failures and rate limits
// const simulateNetworkConditions = require('./middleware/simulateNetworkConditions');
// app.use(simulateNetworkConditions);

// Import routes
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/users');

// Import middleware for checking authentication
const checkAuth = require('./middleware/checkAuth');

// Define routes
app.use('/', authRoutes);
app.use('/', checkAuth, userRoutes);

// Start the server and listen on the defined port
app.listen(port, '0.0.0.0', () => {
  console.log(`Mock server running at http://0.0.0.0:${port}`);
});