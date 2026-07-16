'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('doctor_availabilities', 'is_available', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('doctor_availabilities', 'is_available');
  }
};
