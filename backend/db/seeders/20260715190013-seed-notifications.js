'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notifications = [
      {
        id: 1,
        recipient_id: 12, // Patient User ID 12 (John Doe)
        title: 'Appointment Scheduled',
        message: 'Your online consultation with Dr. Sarah Conner is scheduled for today at 10:00 AM.',
        notification_type: 'AppointmentScheduled',
        is_read: false,
        related_entity: 'Appointment',
        related_entity_id: 11,
        created_at: new Date(Date.now() - 2 * 24 * 3600000),
        updated_at: new Date(Date.now() - 2 * 24 * 3600000)
      },
      {
        id: 2,
        recipient_id: 4, // Doctor User ID 4 (Robert Chen)
        title: 'Critical Vital Alert',
        message: 'Patient John Doe logged critical vitals: Blood Pressure 152/98 mmHg.',
        notification_type: 'VitalAlert',
        is_read: false,
        related_entity: 'VitalsAlert',
        related_entity_id: 1,
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 12 * 3600000)
      },
      {
        id: 3,
        recipient_id: 13, // Patient User ID 13 (Jane Johnson)
        title: 'New Prescription Issued',
        message: 'Dr. Elena Rostova has issued a prescription for Mild Persistent Asthma.',
        notification_type: 'PrescriptionIssued',
        is_read: true,
        related_entity: 'Prescription',
        related_entity_id: 2,
        created_at: new Date(Date.now() - 4 * 24 * 3600000),
        updated_at: new Date(Date.now() - 3 * 24 * 3600000)
      },
      {
        id: 4,
        recipient_id: 3, // Doctor User ID 3 (David Miller)
        title: 'New Connection Request',
        message: 'Patient James Williams has sent a doctor request. Check dashboard to resolve.',
        notification_type: 'RequestReceived',
        is_read: false,
        related_entity: 'DoctorRequest',
        related_entity_id: 22,
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 12 * 3600000)
      }
    ];

    await queryInterface.bulkInsert('notifications', notifications, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
