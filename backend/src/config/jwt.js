module.exports = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_key_12345',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key_67890',
  accessExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};
