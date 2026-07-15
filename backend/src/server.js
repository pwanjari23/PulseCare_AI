const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { validateEnv } = require('./config/envValidator');
const logger = require('./config/logger');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make socket IO available globally in app if needed
app.set('io', io);

// Handle basic Socket.IO connections
io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  // Example real-time event
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    logger.debug(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Handle uncaught system exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Start database and server
const startServer = async () => {
  try {
    // Validate Environment Variables
    validateEnv();

    // Verify Database connection
    await connectDB();
    
    server.listen(port, () => {
      logger.info(`PulseCare AI server is running in [${process.env.NODE_ENV || 'development'}] mode on port ${port}`);
    });
  } catch (error) {
    logger.error(`Server startup aborted. Reason: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED PROMISE REJECTION: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }
  // Graceful server shutdown
  server.close(() => {
    process.exit(1);
  });
});

startServer();
