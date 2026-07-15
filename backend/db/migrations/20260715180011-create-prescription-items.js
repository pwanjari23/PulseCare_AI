'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescription_items', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      prescription_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'prescriptions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      medication_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      dosage: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      frequency: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      duration_days: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
      },
      instructions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('prescription_items', ['prescription_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prescription_items');
  },
};
