'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctors', {
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
      license_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      specialization_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'specializations',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      clinic_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      clinic_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      clinic_zip: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      experience_years: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
      },
      profile_photo_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      rating_avg: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      reviews_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      consultation_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      languages: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by_admin_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      last_active_at: {
        type: Sequelize.DATE,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('doctors', ['specialization_id']);
    await queryInterface.addIndex('doctors', ['license_number']);
    await queryInterface.addIndex('doctors', ['is_verified']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('doctors');
  },
};
