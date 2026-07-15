const { ROLES } = require('#constants/index.js');

/**
 * Mapped roles reused from core constants
 */
const USER_ROLES = {
  ADMIN: ROLES.ADMIN,
  DOCTOR: ROLES.DOCTOR,
  PATIENT: ROLES.PATIENT
};

/**
 * Token descriptors
 */
const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

/**
 * HTTP cookie name strings
 */
const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken'
};

/**
 * Reusable HTTP status codes mapping
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  USER_ROLES,
  TOKEN_TYPES,
  COOKIE_NAMES,
  HTTP_STATUS
};
