const { logger } = require('../utils/logger');

/**
 * Middleware that measures and logs API response times
 */
const responseTimeLogger = (req, res, next) => {
  const start = process.hrtime();
  
  // Function to log response time
  const logResponseTime = () => {
    const end = process.hrtime(start);
    const responseTimeMs = (end[0] * 1000 + end[1] / 1000000).toFixed(2);
    
    // Log all responses
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTimeMs}ms`);
    
    // Log slow responses separately for easier performance debugging
    if (responseTimeMs > 500) {
      logger.warn(`Slow API Response: ${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: responseTimeMs,
        userAgent: req.get('user-agent'),
        contentLength: res.get('content-length'),
        body: req.body
      });
    }
  };
  
  // Listen for 'finish' event
  res.on('finish', logResponseTime);
  
  next();
};

/**
 * Middleware that monitors MongoDB connection
 * To be used at application startup
 */
const monitorDatabaseConnection = (mongoose) => {
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });
  
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
  
  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
  
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });
  
  mongoose.connection.on('reconnectFailed', () => {
    logger.error('MongoDB reconnection failed');
  });

  // Log slow queries
  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    const query = JSON.stringify(methodArgs[0] || {});
    const start = process.hrtime();
    
    // Override the callback to measure query time
    if (methodArgs.length > 0 && typeof methodArgs[methodArgs.length - 1] === 'function') {
      const originalCallback = methodArgs[methodArgs.length - 1];
      
      methodArgs[methodArgs.length - 1] = function(err, result) {
        const end = process.hrtime(start);
        const queryTimeMs = (end[0] * 1000 + end[1] / 1000000).toFixed(2);
        
        // Log slow queries (>100ms)
        if (queryTimeMs > 100) {
          logger.warn(`Slow MongoDB Query: ${collectionName}.${methodName}`, {
            collection: collectionName,
            operation: methodName,
            query: query,
            executionTime: queryTimeMs
          });
        }
        
        // Call the original callback
        originalCallback(err, result);
      };
    }
  });
};

/**
 * Middleware for memory usage monitoring
 */
const memoryUsageMonitor = (req, res, next) => {
  // Check memory every 100th request to minimize overhead
  if (Math.random() < 0.01) {
    const memoryUsage = process.memoryUsage();
    const memoryData = {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
    };
    
    // Log high memory usage
    if (memoryUsage.rss > 1024 * 1024 * 500) { // Over 500MB
      logger.warn('High memory usage detected', memoryData);
    } else {
      logger.info('Memory usage stats', memoryData);
    }
  }
  
  next();
};

module.exports = {
  responseTimeLogger,
  monitorDatabaseConnection,
  memoryUsageMonitor
};