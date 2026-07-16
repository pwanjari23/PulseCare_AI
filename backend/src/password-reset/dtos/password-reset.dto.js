/**
 * PulseCare AI – Password Reset DTOs
 */

const toForgotResponseDto = () => {
  return {
    success: true,
    message: 'If an account with this email exists, password reset instructions have been sent.',
  };
};

const toResetResponseDto = () => {
  return {
    success: true,
    message: 'Password reset successfully.',
  };
};

module.exports = {
  toForgotResponseDto,
  toResetResponseDto,
};
