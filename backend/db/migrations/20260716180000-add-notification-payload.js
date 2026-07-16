'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add payload JSON column if it doesn't already exist
    const tableInfo = await queryInterface.describeTable('notifications');
    if (!tableInfo.payload) {
      await queryInterface.addColumn('notifications', 'payload', {
        type: Sequelize.JSON,
        allowNull: true
      });
    }

    // 2. Temporarily expand ENUM column to contain BOTH old and new values
    await queryInterface.changeColumn('notifications', 'notification_type', {
      type: Sequelize.ENUM(
        'VitalAlert', 'PrescriptionIssued', 'AppointmentScheduled', 'RequestReceived', 'System',
        'Appointment', 'DoctorApproval', 'Prescription', 'Reminder'
      ),
      allowNull: false
    });

    // 3. Update existing records in the table mapping old values to new values
    await queryInterface.sequelize.query(`
      UPDATE notifications 
      SET notification_type = CASE 
        WHEN notification_type = 'PrescriptionIssued' THEN 'Prescription'
        WHEN notification_type = 'AppointmentScheduled' THEN 'Appointment'
        WHEN notification_type = 'RequestReceived' THEN 'DoctorApproval'
        ELSE notification_type
      END
    `);

    // 4. Shrink the ENUM definition to the final desired set
    await queryInterface.changeColumn('notifications', 'notification_type', {
      type: Sequelize.ENUM('Appointment', 'VitalAlert', 'DoctorApproval', 'Prescription', 'Reminder', 'System'),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Expand ENUM again to contain both
    await queryInterface.changeColumn('notifications', 'notification_type', {
      type: Sequelize.ENUM(
        'VitalAlert', 'PrescriptionIssued', 'AppointmentScheduled', 'RequestReceived', 'System',
        'Appointment', 'DoctorApproval', 'Prescription', 'Reminder'
      ),
      allowNull: false
    });

    // 2. Map new values back to old values
    await queryInterface.sequelize.query(`
      UPDATE notifications 
      SET notification_type = CASE 
        WHEN notification_type = 'Prescription' THEN 'PrescriptionIssued'
        WHEN notification_type = 'Appointment' THEN 'AppointmentScheduled'
        WHEN notification_type = 'DoctorApproval' THEN 'RequestReceived'
        ELSE notification_type
      END
    `);

    // 3. Revert ENUM column to original
    await queryInterface.changeColumn('notifications', 'notification_type', {
      type: Sequelize.ENUM('VitalAlert', 'PrescriptionIssued', 'AppointmentScheduled', 'RequestReceived', 'System'),
      allowNull: false
    });

    // 4. Remove payload JSON column if it exists
    const tableInfo = await queryInterface.describeTable('notifications');
    if (tableInfo.payload) {
      await queryInterface.removeColumn('notifications', 'payload');
    }
  }
};
