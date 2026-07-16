'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('prescriptions');

    // 1. Add appointment_id nullable FK column
    if (!tableInfo.appointment_id) {
      await queryInterface.addColumn('prescriptions', 'appointment_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'appointments',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      await queryInterface.addIndex('prescriptions', ['appointment_id']);
    }

    // 2. Extend diagnosis from VARCHAR(255) to TEXT
    await queryInterface.changeColumn('prescriptions', 'diagnosis', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // 3. Extend prescription_items.dosage from VARCHAR(50) to VARCHAR(100)
    const itemsTableInfo = await queryInterface.describeTable('prescription_items');
    if (itemsTableInfo.dosage && itemsTableInfo.dosage.type !== 'VARCHAR(100)') {
      await queryInterface.changeColumn('prescription_items', 'dosage', {
        type: Sequelize.STRING(100),
        allowNull: false
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert appointment_id
    const tableInfo = await queryInterface.describeTable('prescriptions');
    if (tableInfo.appointment_id) {
      await queryInterface.removeColumn('prescriptions', 'appointment_id');
    }

    // Revert diagnosis to VARCHAR(255)
    await queryInterface.changeColumn('prescriptions', 'diagnosis', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    // Revert dosage to VARCHAR(50)
    await queryInterface.changeColumn('prescription_items', 'dosage', {
      type: Sequelize.STRING(50),
      allowNull: false
    });
  }
};
