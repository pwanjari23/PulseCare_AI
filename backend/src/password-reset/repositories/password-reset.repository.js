const { User, PasswordResetToken, RefreshToken, ActivityLog } = require('#models/index.js');

const findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const findResetToken = async (tokenHash) => {
  return PasswordResetToken.findOne({
    where: { tokenHash },
    include: [{ model: User, as: 'user', attributes: { exclude: ['passwordHash', 'password_hash'] } }],
  });
};

const deleteResetToken = async (userId, transaction) => {
  return PasswordResetToken.destroy({
    where: { userId },
    transaction,
  });
};

const createResetToken = async (data, transaction) => {
  return PasswordResetToken.create(data, { transaction });
};

const updatePassword = async (userId, newPasswordHash, transaction) => {
  return User.update(
    { passwordHash: newPasswordHash },
    { where: { id: userId }, transaction }
  );
};

const deleteAllRefreshTokens = async (userId, transaction) => {
  return RefreshToken.destroy({
    where: { userId },
    transaction,
  });
};

const insertActivityLog = async (data, transaction) => {
  return ActivityLog.create(data, { transaction });
};

module.exports = {
  findUserByEmail,
  findResetToken,
  deleteResetToken,
  createResetToken,
  updatePassword,
  deleteAllRefreshTokens,
  insertActivityLog,
};
