const { RefreshToken } = require('#models/index.js');

/**
 * Creates a new refresh token record
 * @param {object} tokenData - Token properties (userId, token, expiresAt, isRevoked)
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<RefreshToken>} The created token instance
 */
const createRefreshToken = async (tokenData, transaction) => {
  return RefreshToken.create(tokenData, { transaction });
};

/**
 * Finds a refresh token record by its token string
 * @param {string} token - The token string to search
 * @returns {Promise<RefreshToken|null>} The found token instance or null
 */
const findRefreshToken = async (token) => {
  return RefreshToken.findOne({ where: { token } });
};

/**
 * Deletes/destroys a refresh token record
 * @param {string} token - The token string to delete
 * @returns {Promise<number>} Number of deleted rows
 */
const deleteRefreshToken = async (token) => {
  return RefreshToken.destroy({ where: { token } });
};

/**
 * Deletes all refresh tokens issued to a specific user
 * @param {number|string} userId - The user ID to flush
 * @returns {Promise<number>} Number of deleted rows
 */
const deleteAllUserRefreshTokens = async (userId) => {
  return RefreshToken.destroy({ where: { userId } });
};

module.exports = {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens
};
