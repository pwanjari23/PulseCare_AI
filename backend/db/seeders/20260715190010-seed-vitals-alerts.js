'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const alerts = [
      {
        id: 1,
        patient_id: 12,
        vitals_log_id: 2, // Abnormal BP log
        doctor_id: 4, // Primary Doctor
        alert_type: 'Critical',
        status: 'Open',
        resolved_at: null,
        resolution_notes: null,
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 12 * 3600000)
      },
      {
        id: 2,
        patient_id: 13,
        vitals_log_id: 4, // Abnormal SpO2 log
        doctor_id: 5,
        alert_type: 'Critical',
        status: 'Open',
        resolved_at: null,
        resolution_notes: null,
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 12 * 3600000)
      },
      {
        id: 3,
        patient_id: 14,
        vitals_log_id: 6, // Abnormal glucose log
        doctor_id: 6,
        alert_type: 'Critical',
        status: 'Acknowledged',
        resolved_at: null,
        resolution_notes: 'Doctor acknowledged glucose spike, patient advised to take insulin dose adjustment.',
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 11 * 3600000)
      },
      {
        id: 4,
        patient_id: 15,
        vitals_log_id: 8, // Abnormal pulse log
        doctor_id: 7,
        alert_type: 'Warning',
        status: 'Resolved',
        resolved_at: new Date(Date.now() - 10 * 3600000),
        resolution_notes: 'Patient was resting, heart rate returned to 78 bpm. Case closed.',
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 10 * 3600000)
      }
    ];

    await queryInterface.bulkInsert('vitals_alerts', alerts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vitals_alerts', null, {});
  }
};
