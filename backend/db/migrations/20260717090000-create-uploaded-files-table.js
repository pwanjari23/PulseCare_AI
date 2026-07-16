'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('uploaded_files', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true,
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      stored_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      extension: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      size_bytes: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM(
          'PROFILE_IMAGE',
          'DOCTOR_DOCUMENT',
          'PRESCRIPTION',
          'MEDICAL_REPORT',
          'LAB_REPORT'
        ),
        allowNull: false,
      },
      storage_provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'local',
      },
      storage_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      uploaded_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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

    await queryInterface.addIndex('uploaded_files', ['uploaded_by']);
    await queryInterface.addIndex('uploaded_files', ['category']);
    await queryInterface.addIndex('uploaded_files', ['uuid'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('uploaded_files');
  },
};
