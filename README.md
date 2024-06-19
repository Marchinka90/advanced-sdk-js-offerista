# Advanced JavaScript SDK for APIs

Advanced JavaScript SDK is a client library that simplifies interaction with the APIs, providing authentication, user management, and batch operations functionalities. This SDK is designed to facilitate seamless integration of services into JavaScript applications.

## Getting started

Use the package manager npm to install all dependencies.

```bash
npm install
```

Set up the AdvancedSDK class

```bash
import { AdvancedSDK } from '../src/index.js';

// Initialize the AdvancedSDK with your credentials and API base URL
const sdk = new AdvancedSDK('your_email@example.com', 'your_password', 'https://api.my-sdk.com');
```


### Authentication
#### To authenticate a user and obtain access to the API:
```bash
// Authenticate the user
sdk.auth.authenticate()
  .then(() => {
    // User authenticated successfully, proceed with API requests
  })
  .catch(error => {
    console.error('Authentication failed:', error);
  });
```

### User Operations

#### Fetching a User by ID
```bash
sdk.user.getUserById(userId)
  .then(user => {
    console.log('User details:', user);
  })
  .catch(error => {
    console.error('Error fetching user:', error);
  });
```

#### Creating a User
```bash
const userData = {
  name: 'newuser',
  email: 'newuser@example.com',
  password: 'newpassword',
  phone: 'newphone'
};

sdk.user.createUser(userData)
  .then(newUser => {
    console.log('New user created:', newUser);
  })
  .catch(error => {
    console.error('Error creating user:', error);
  });
```

#### Updating a User
```bash
const userId = 123;
const updatedUserData = {
  name: 'updateduser',
  email: 'updateduser@example.com',
  phone: 'nupdatephone'
};

sdk.user.updateUser(userId, updatedUserData)
  .then(updatedUser => {
    console.log('User updated successfully:', updatedUser);
  })
  .catch(error => {
    console.error('Error updating user:', error);
  });
```

#### Deleting a User
```bash
const userId = 123;

sdk.user.deleteUser(userId)
  .then(() => {
    console.log('User deleted successfully');
  })
  .catch(error => {
    console.error('Error deleting user:', error);
  });
```

### Batch Operations

#### Fetching Multiple Users
```bash
const userIds = [1, 2, 3, 4, 5];

sdk.user.getUsersBatch(userIds)
  .then(users => {
    console.log('Fetched users:', users);
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });
```

#### Updating Multiple Users
```bash
const usersToUpdate = [
  { id: 1, name: 'updated1',  },
  { id: 2, name: 'updated2' }
];

sdk.user.updateUsersBatch(usersToUpdate)
  .then(updatedUsers => {
    console.log('Updated users:', updatedUsers);
  })
  .catch(error => {
    console.error('Error updating users:', error);
  });
```

#### Deletign Multiple Users
```bash
const userIds = [1, 2, 3, 4, 5];

sdk.user.deleteUsersBatch(userIds)
  .then(updatedUsers => {
    console.log('Updated users:', updatedUsers);
  })
  .catch(error => {
    console.error('Error updating users:', error);
  });
```
### Building everything up in bundle.js file located in dist folder by runinng this command 
```bash
npm run build
```

### Error Handling

All methods return Promises and handle errors through standard JavaScript catch blocks. Ensure proper error handling in your application to manage potential network issues, server errors, or invalid requests.

## Test (OPTIONAL)

### Setting Up the Mock Server

Use the package manager npm to install all dependencies in server directory

```bash
npm install
```

Launch the mock server 
```bash
npm run start
```
Mock server works on port:5000 (configurable)

### Setting Up HTTP Server
```bash
npm install --global serve
serve -p 8080
```

Http server works on port:8080 (configurable). Navigate to http://localhost:8080/example. 
#### Option 1 - use credentials of your choise - email, password and actual api endpoint.
#### Option 2 - use test for the mock server:
```bash
baseUrl: 'http://localhost:5000'
email: 'test@yahoo.com' 
password: '123456', 
```

## Docker (optional)

#### Building image with Dockerfile
```bash
docker build -t advanced-sdk:1.0 .
```
#### Deployingthe container using the new image
```bash
docker run -d -p 8080:8080 -p 5000:5000 advanced-sdk:1.0
```
Example application is hosted on http://localhost:8080 and mock server is on http://localhost:5000


