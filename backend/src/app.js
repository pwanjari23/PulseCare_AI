const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const logger = require('./config/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { ApiError } = require('./utils/apiResponse');

const app = express();

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

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Stream morgan http request logs into Winston
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

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
