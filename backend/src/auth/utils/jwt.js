const jwt = require('jsonwebtoken');
const config = require('#config/jwt.js');

/**
 * Generates a short-lived access token with minimized payload
 * @param {object} user - The user instance
 * @returns {string} The signed JWT access token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email
  };
  return jwt.sign(payload, config.accessSecret, {
    expiresIn: config.accessExpiry
  });
};

/**
 * Generates a long-lived refresh token with minimal payload
 * @param {object} user - The user instance
 * @returns {string} The signed JWT refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id
  };
  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: config.refreshExpiry
  });
};

/**
 * Verifies a JWT access token
 * @param {string} token - The access token
 * @returns {object} Decoded payload
 * @throws {Error} If verification fails
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.accessSecret);
  } catch (error) {
    throw new Error(`Access token verification failed: ${error.message}`);
  }
};

/**
 * Verifies a JWT refresh token
 * @param {string} token - The refresh token
 * @returns {object} Decoded payload
 * @throws {Error} If verification fails
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.refreshSecret);
  } catch (error) {
    throw new Error(`Refresh token verification failed: ${error.message}`);
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
