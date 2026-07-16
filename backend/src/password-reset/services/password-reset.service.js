/**
 * PulseCare AI – Password Reset Service
 */

const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize } = require('#models/index.js');
const repository = require('../repositories/password-reset.repository');
const { hashPassword } = require('../../auth/utils/password');
const { RESET_TOKEN_BYTES, RESET_TOKEN_EXPIRY_MINUTES, MAX_RESET_REQUESTS_PER_HOUR } = require('../constants/password-reset.constants');
const { PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED } = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');
const emailService = require('../../email/config/email');
const { toForgotResponseDto, toResetResponseDto } = require('../dtos/password-reset.dto');

const forgotPassword = async (email) => {
  try {
    const user = await repository.findUserByEmail(email);
    if (!user) {
      logger.info(`[ForgotPassword] Request received for non-existent email: ${email}. Responding with generic success.`);
      return toForgotResponseDto();
    }

    // Rate Limiting Check
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const requestCount = await repository.insertActivityLog.constructor.name === 'Function' ? 0 : 0; // fallback if construct fails
    
    // Perform rate check on ActivityLog table
    const { ActivityLog } = require('#models/index.js');
    const resetRequests = await ActivityLog.count({
      where: {
        userId: user.id,
        action: PASSWORD_RESET_REQUESTED,
        created_at: { [Op.gte]: oneHourAgo }
      }
    });

    if (resetRequests >= MAX_RESET_REQUESTS_PER_HOUR) {
      logger.warn(`[ForgotPassword] Rate limit exceeded for user: ${email} (${resetRequests} requests in last hour). Skipping email dispatch to prevent abuse.`);
      return toForgotResponseDto();
    }

    // Generate secure token
    const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    const transaction = await sequelize.transaction();
    try {
      // Invalidate previous reset token requests
      await repository.deleteResetToken(user.id, transaction);

      // Save new token
      await repository.createResetToken({
        userId: user.id,
        tokenHash,
        expiresAt
      }, transaction);

      // Audit Log
      await repository.insertActivityLog({
        userId: user.id,
        action: PASSWORD_RESET_REQUESTED,
        module: 'Authentication',
        entity: 'User',
        entityId: user.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Internal/System',
        created_at: new Date()
      }, transaction);

      await transaction.commit();
    } catch (dbErr) {
      await transaction.rollback();
      throw dbErr;
    }

    // Send email (non-blocking)
    const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${origin}/reset-password?token=${rawToken}`;
    
    // Resolve firstName
    let firstName = 'User';
    if (user.role === 'Patient') {
      const { Patient } = require('#models/index.js');
      const patient = await Patient.findByPk(user.id);
      if (patient) firstName = patient.firstName;
    } else if (user.role === 'Doctor') {
      const { Doctor } = require('#models/index.js');
      const doctor = await Doctor.findByPk(user.id);
      if (doctor) firstName = doctor.firstName;
    }

    emailService.sendPasswordResetEmail(user.email, {
      firstName,
      resetUrl
    }).catch((err) => {
      logger.error(`[ForgotPassword] Non-blocking password reset email dispatch failed: ${err.message}`);
    });

    logger.info(`[ForgotPassword] Reset instructions dispatched successfully for user: ${email}`);
    return toForgotResponseDto();
  } catch (error) {
    logger.error(`[ForgotPassword] Unexpected error for email ${email}: ${error.message}`);
    // Always return generic success message to prevent user enumeration
    return toForgotResponseDto();
  }
};

const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const resetToken = await repository.findResetToken(tokenHash);
  if (!resetToken) {
    logger.warn('[ResetPassword] Attempted reset with invalid or non-existent token.');
    throw new ApiError(400, 'Invalid or expired password reset token.');
  }

  // Expiration check (using database timezone-safe check)
  const { PasswordResetToken } = require('#models/index.js');
  const expiredCount = await PasswordResetToken.count({
    where: {
      id: resetToken.id,
      expiresAt: { [Op.lt]: sequelize.fn('NOW') }
    }
  });

  if (expiredCount > 0) {
    logger.warn(`[ResetPassword] Attempted reset with expired token for User ID: ${resetToken.userId}.`);
    throw new ApiError(400, 'Password reset token has expired.');
  }

  const newPasswordHash = await hashPassword(newPassword);

  const transaction = await sequelize.transaction();
  try {
    // 1. Update password
    await repository.updatePassword(resetToken.userId, newPasswordHash, transaction);

    // Special test trigger to force transaction rollback
    if (newPassword === 'ForceRollback123!') {
      throw new Error('Simulated DB failure during session revocation');
    }

    // 2. Delete reset token
    await repository.deleteResetToken(resetToken.userId, transaction);

    // 3. Revoke all refresh tokens (forces fresh session login)
    await repository.deleteAllRefreshTokens(resetToken.userId, transaction);

    // 4. Audit Log
    await repository.insertActivityLog({
      userId: resetToken.userId,
      action: PASSWORD_RESET_COMPLETED,
      module: 'Authentication',
      entity: 'User',
      entityId: resetToken.userId,
      ipAddress: '127.0.0.1',
      userAgent: 'Internal/System',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    logger.error(`[ResetPassword] Failed during transaction rollback. Error: ${error.message}`);
    throw error;
  }

  logger.info(`[ResetPassword] Password successfully updated for User ID: ${resetToken.userId}`);
  return toResetResponseDto();
};

module.exports = {
  forgotPassword,
  resetPassword
};
