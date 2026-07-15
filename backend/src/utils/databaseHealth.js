const { sequelize } = require('../models');

/**
 * Checks connection health metrics for the MySQL server database
 */
const checkDatabaseHealth = async () => {
  try {
    const startTime = Date.now();
    await sequelize.authenticate();
    const latencyMs = Date.now() - startTime;
    
    return {
      status: 'HEALTHY',
      message: 'Database is reachable and responding normally.',
      details: {
        latencyMs,
        dialect: sequelize.getDialect(),
        database: sequelize.config.database,
        host: sequelize.config.host,
      },
    };
  } catch (error) {
    return {
      status: 'UNHEALTHY',
      message: `Database health check validation failed: ${error.message}`,
      details: {
        errorName: error.name,
      },
    };
  }
};

module.exports = {
  checkDatabaseHealth,
};
