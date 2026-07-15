'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patients', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      blood_type: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      primary_doctor_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      profile_photo_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      height_cm: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      emergency_contact_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      emergency_contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      emergency_contact_relation: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      medical_conditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      smoking_status: {
        type: Sequelize.ENUM('Non-smoker', 'Former smoker', 'Active smoker'),
        allowNull: true,
      },
      alcohol_consumption: {
        type: Sequelize.ENUM('None', 'Occasional', 'Regular', 'Heavy'),
        allowNull: true,
      },
      last_vital_submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      profile_completion_pct: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('patients', ['primary_doctor_id']);
    await queryInterface.addIndex('patients', ['gender']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patients');
  },
};
