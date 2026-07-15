'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vitals_alerts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      vitals_log_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'vitals_logs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      doctor_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      alert_type: {
        type: Sequelize.ENUM('Warning', 'Critical'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Open', 'Acknowledged', 'Resolved'),
        allowNull: false,
        defaultValue: 'Open',
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resolution_notes: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('vitals_alerts', ['patient_id']);
    await queryInterface.addIndex('vitals_alerts', ['vitals_log_id']);
    await queryInterface.addIndex('vitals_alerts', ['doctor_id']);
    await queryInterface.addIndex('vitals_alerts', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vitals_alerts');
  },
};
