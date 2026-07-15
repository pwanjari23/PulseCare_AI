require('dotenv').config();
const logger = require('./logger');

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'pulsecare_db';
const dbTestName = process.env.DB_TEST_NAME || 'pulsecare_test_db';

const commonConfig = {
  dialect: 'mysql',
  host: dbHost,
  port: dbPort,
  timezone: '+00:00', // Standardize database queries on UTC
  define: {
    timestamps: true,
    underscored: true, // Map camelCase properties to snake_case column names
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {
    decimalNumbers: true, // Parse decimals as floats rather than text strings
    dateStrings: true,
    typeCast: true,
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
    ],
    max: 3, // Retry connection up to 3 times on dropped sessions
  },
};

module.exports = {
  development: {
    ...commonConfig,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    logging: (sql) => logger.debug(`[SQL] ${sql}`),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    ...commonConfig,
    username: dbUser,
    password: dbPassword,
    database: dbTestName,
    logging: false, // Suppress logger prints during unit tests
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    ...commonConfig,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    logging: false,
    pool: {
      max: 30, // High pool capacity for enterprise operations
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
  },
};
