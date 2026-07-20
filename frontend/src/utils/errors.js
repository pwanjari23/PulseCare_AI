export class AppError extends Error {
  constructor(message, status = null, errors = []) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiError extends AppError {
  constructor(message = 'An API error occurred', status = 500, errors = []) {
    super(message, status, errors);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', status = 422, errors = []) {
    super(message, status, errors);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Unauthorized access', status = 403, errors = []) {
    super(message, status, errors);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failed', errors = []) {
    super(message, 0, errors);
  }
}
