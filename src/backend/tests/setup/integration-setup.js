const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

let mongoServer;

// Make the Express app and SuperTest request available globally
global.app = app;
global.request = request;

// Setup in-memory MongoDB server for tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Create a test user for auth-protected endpoints
  const testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: await require('bcryptjs').hash('password123', 10)
  });
  
  await testUser.save();
  
  // Create and set a token for authenticated requests
  global.testUserId = testUser._id;
  global.authToken = jwt.sign(
    { id: testUser._id }, 
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1h' }
  );
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (key !== 'users') { // Keep test user
      await collection.deleteMany({});
    }
  }
});

// Close connection and stop MongoDB server after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Silence console output during tests except errors
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error logging enabled for troubleshooting integration tests
};