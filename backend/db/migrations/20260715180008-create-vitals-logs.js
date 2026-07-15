'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vitals_logs', {
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
      heart_rate: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
      },
      systolic_bp: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
      },
      diastolic_bp: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
      },
      oxygen_level: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      temperature: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      logged_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      triage_status: {
        type: Sequelize.ENUM('Normal', 'Warning', 'Critical'),
        allowNull: false,
        defaultValue: 'Normal',
      },
      respiratory_rate: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: true,
      },
      blood_glucose_mgdl: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      blood_glucose_type: {
        type: Sequelize.ENUM('Fasting', 'Random', 'Post-Meal'),
        allowNull: true,
      },
      pain_level: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
      },
      sleep_hours: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
      },
      symptoms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mood: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      source: {
        type: Sequelize.ENUM('Manual', 'Bluetooth', 'Wearable', 'Imported'),
        allowNull: false,
        defaultValue: 'Manual',
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

    await queryInterface.addIndex('vitals_logs', ['patient_id']);
    await queryInterface.addIndex('vitals_logs', ['logged_at']);
    await queryInterface.addIndex('vitals_logs', ['triage_status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vitals_logs');
  },
};
