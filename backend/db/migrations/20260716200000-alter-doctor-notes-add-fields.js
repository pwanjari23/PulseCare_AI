'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('doctor_notes');

    // 1. Add title column (VARCHAR 200, NOT NULL with default for existing rows)
    if (!tableInfo.title) {
      await queryInterface.addColumn('doctor_notes', 'title', {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: 'Clinical Note'
      });
    }

    // 2. Add appointment_id nullable FK
    if (!tableInfo.appointment_id) {
      await queryInterface.addColumn('doctor_notes', 'appointment_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'appointments',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      await queryInterface.addIndex('doctor_notes', ['appointment_id']);
    }

    // 3. Add is_archived boolean flag (default false)
    if (!tableInfo.is_archived) {
      await queryInterface.addColumn('doctor_notes', 'is_archived', {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      });
      await queryInterface.addIndex('doctor_notes', ['is_archived']);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('doctor_notes');

    if (tableInfo.is_archived) {
      await queryInterface.removeColumn('doctor_notes', 'is_archived');
    }
    if (tableInfo.appointment_id) {
      await queryInterface.removeColumn('doctor_notes', 'appointment_id');
    }
    if (tableInfo.title) {
      await queryInterface.removeColumn('doctor_notes', 'title');
    }
  }
};
