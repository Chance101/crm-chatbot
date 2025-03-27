const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { logger, requestLogger } = require('./utils/logger');
const { responseTimeLogger, monitorDatabaseConnection, memoryUsageMonitor } = require('./middleware/performance');

// Load environment variables
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize Express app
const app = express();

// Apply basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Add request logging - use Morgan for dev-friendly output and our custom logger for structured logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Dev-friendly console output
}

// Apply performance monitoring and logging middleware
app.use(requestLogger); // Structured request logging for all environments
app.use(responseTimeLogger); // Performance monitoring for API response times
app.use(memoryUsageMonitor); // Monitor memory usage

// Apply rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Set up API routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint for container orchestration
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Connect to MongoDB with performance monitoring
// Set up database connection monitoring
monitorDatabaseConnection(mongoose);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', { error: err.message, stack: err.stack }));

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error with all available details
  logger.error('Server error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    statusCode: err.statusCode || 500
  });
  
  // Send appropriate error response
  const statusCode = err.statusCode || 500;
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred while processing your request' 
    : err.message || 'Server error';
    
  res.status(statusCode).json({ 
    error: errorMessage,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    // Include validation errors if available
    ...(err.details && { details: err.details })
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
    nodeVersion: process.version
  });
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', {
    error: err.message,
    stack: err.stack
  });
  
  // Exit with failure
  process.exit(1);
});

module.exports = app; // For testing purposes
