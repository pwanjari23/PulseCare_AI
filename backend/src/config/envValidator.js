const logger = require('./logger');

const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_NAME',
  'JWT_SECRET',
  'PORT',
];

/**
 * Validates that all required env variables are declared in process.env
 */
const validateEnv = () => {
  const missing = [];
  
  REQUIRED_ENV_VARS.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    logger.error(`CRITICAL: Server startup aborted due to missing configuration variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  logger.info('Environment variables validation complete: OK');
};

module.exports = {
  validateEnv,
};
