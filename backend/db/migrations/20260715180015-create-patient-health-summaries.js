'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_health_summaries', {
      patient_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      health_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 100,
      },
      risk_level: {
        type: Sequelize.ENUM('Low', 'Medium', 'High', 'Critical'),
        allowNull: false,
        defaultValue: 'Low',
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

    await queryInterface.addIndex('patient_health_summaries', ['risk_level']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patient_health_summaries');
  },
};
