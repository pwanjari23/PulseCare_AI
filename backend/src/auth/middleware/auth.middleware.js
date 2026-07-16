const { ApiError } = require('#utils/apiResponse.js');
const authRepository = require('../repositories/auth.repository');
const { verifyAccessToken } = require('../utils/jwt');
const logger = require('#config/logger.js');

/**
 * Authenticates requests using JWT Access Tokens
 * Checks token validity, database existence, and account status
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 2. If Authorization header is missing
    if (!authHeader) {
      logger.warn('[Auth Middleware] Authentication rejected: Access token is required.');
      return next(new ApiError(401, 'Access token is required.'));
    }

    // 3. If Authorization header format is invalid
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn('[Auth Middleware] Authentication rejected: Invalid authorization header format.');
      return next(new ApiError(401, 'Invalid authorization header.'));
    }

    const token = parts[1];

    // 5. Verify JWT using the existing utility verifyAccessToken()
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      logger.warn(`[Auth Middleware] Authentication rejected: ${error.message}`);
      return next(new ApiError(401, 'Invalid or expired access token.'));
    }

    // 6. Validate decoded payload contains id, role, email
    if (!decoded || !decoded.id || !decoded.role || !decoded.email) {
      logger.warn('[Auth Middleware] Authentication rejected: Malformed JWT payload.');
      return next(new ApiError(401, 'Invalid or expired access token.'));
    }

    // 7. Fetch the latest user from the database (never trust JWT payload alone)
    const user = await authRepository.findUserById(decoded.id);

    // 8. If user no longer exists
    if (!user) {
      logger.warn(`[Auth Middleware] Authentication rejected: User ID ${decoded.id} not found in database.`);
      return next(new ApiError(401, 'User not found.'));
    }

    // 9. Verify account status
    if (user.status !== 'Active') {
      logger.warn(`[Auth Middleware] Authentication rejected: User ID ${user.id} account status is ${user.status}.`);
      return next(new ApiError(403, 'Your account is inactive or suspended.'));
    }

    // 10. Attach sanitized user object to req.user
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    logger.debug(`[Auth Middleware] User ID ${user.id} (${user.email}) successfully authenticated.`);
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Reusable role-based authorization middleware generator
 * @param {...string} allowedRoles - Array of roles allowed to access the endpoint
 * @returns {function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // If req.user is missing
    if (!req.user) {
      logger.warn('[Auth Middleware] Authorization rejected: req.user is missing.');
      return next(new ApiError(401, 'Access token is required.'));
    }

    // If req.user.role is not inside allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`[Auth Middleware] Authorization rejected: User ID ${req.user.id} (Role: ${req.user.role}) attempted to access restricted route. Allowed roles: [${allowedRoles.join(', ')}].`);
      return next(new ApiError(403, 'You are not authorized to access this resource.'));
    }

    return next();
  };
};

module.exports = {
  authenticate,
  authorize
};
