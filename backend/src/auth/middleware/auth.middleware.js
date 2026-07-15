/**
 * Placeholder authentication middleware
 * Delegates logic to the next handler (to be implemented in subsequent phases)
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const authenticate = (req, res, next) => {
  return next();
};

/**
 * Placeholder role authorization middleware generator
 * Delegates logic to the next handler (to be implemented in subsequent phases)
 * @param {...string} allowedRoles - Array of roles allowed to access the endpoint
 * @returns {function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    return next();
  };
};

module.exports = {
  authenticate,
  authorize
};
