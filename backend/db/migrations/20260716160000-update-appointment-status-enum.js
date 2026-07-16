'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appointments', 'status', {
      type: Sequelize.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Scheduled', 'NoShow'),
      allowNull: false,
      defaultValue: 'Pending',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appointments', 'status', {
      type: Sequelize.ENUM('Scheduled', 'Completed', 'Cancelled', 'NoShow'),
      allowNull: false,
      defaultValue: 'Scheduled',
    });
  }
};
