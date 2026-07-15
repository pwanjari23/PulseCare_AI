const bcrypt = require('bcrypt');

/**
 * Hashes a plain-text password using bcrypt
 * @param {string} password - The plain-text password
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Compares a plain-text password against a hashed password
 * @param {string} password - The plain-text password
 * @param {string} hashedPassword - The bcrypt hashed password
 * @returns {Promise<boolean>} Match confirmation
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error(`Password comparison failed: ${error.message}`);
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
