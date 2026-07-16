// PulseCare AI Server Configuration
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./config/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { ApiError } = require('./utils/apiResponse');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

// Secure the Express application by setting various HTTP headers
app.use(helmet());

// Compress HTTP responses
app.use(compression());

// Set up rate limiting to prevent DDoS and brute-force attempts (enabled in production only to avoid throttling test suites)
if (process.env.NODE_ENV === 'production') {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  });
  app.use('/api', apiLimiter);
}

// Set up CORS
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware (restricted to 2mb payload to mitigate memory exhaustion)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Stream morgan http request logs into Winston
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Expose API documentation (disabled in production environment)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Register API Routes
app.use('/api/v1', routes);
app.use('/api/auth', require('./auth/routes/auth.routes'));

// Serve uploaded files statically
// Files are accessible at: /uploads/<category-dir>/<uuid>.<ext>
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Handle 404 Route Not Found
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
