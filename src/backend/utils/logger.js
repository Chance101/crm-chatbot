const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'crm-chatbot' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log') 
    })
  ]
});

// Add console transport in development environment
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
      })
    ),
  }));
}

// Log HTTP requests
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || 'anonymous'
    });
  });
  
  next();
};

// Log database queries if in development
const mongooseLogger = (collectionName, method, query, doc) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`MongoDB: ${collectionName}.${method}`, {
      query,
      doc: doc ? JSON.stringify(doc) : null,
    });
  }
};

// Wrap methods to log performance
const logPerformance = (name, fn) => {
  return async function(...args) {
    const startTime = Date.now();
    try {
      return await fn.apply(this, args);
    } finally {
      const duration = Date.now() - startTime;
      if (duration > 500) { // Only log slow operations
        logger.warn(`Slow Performance: ${name}`, { duration, args: JSON.stringify(args) });
      }
    }
  };
};

// Create a structured error
const createError = (message, code = 500, details = {}) => {
  const error = new Error(message);
  error.statusCode = code;
  error.details = details;
  return error;
};

module.exports = {
  logger,
  requestLogger,
  mongooseLogger,
  logPerformance,
  createError
};