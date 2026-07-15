const { sequelize } = require('../models');
const logger = require('./logger');

/**
 * Validates connection authorization with the MySQL server
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL Database connection successfully verified through Sequelize ORM.');
  } catch (error) {
    logger.error(`MySQL Database connection verification failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB,
};
