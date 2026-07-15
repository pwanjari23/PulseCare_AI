const { sequelize } = require('../models');

/**
 * Execute operations within a managed database transaction
 * @param {Function} callback - Async operations block mapping database statements
 */
const withTransaction = async (callback) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  withTransaction,
};
