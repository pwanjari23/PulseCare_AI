'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const prescriptions = [
      {
        id: 1,
        patient_id: 12,
        doctor_id: 4,
        clinical_notes: 'Prescribed daily anti-hypertensive therapy. Keep tracking blood pressure twice daily.',
        prescribed_at: new Date(Date.now() - 3 * 24 * 3600000),
        diagnosis: 'Stage 1 Hypertension',
        follow_up_date: '2026-08-15',
        status: 'Active',
        created_at: new Date(Date.now() - 3 * 24 * 3600000),
        updated_at: new Date(Date.now() - 3 * 24 * 3600000)
      },
      {
        id: 2,
        patient_id: 13,
        doctor_id: 5,
        clinical_notes: 'Asthma symptoms exacerbation tracking. Take inhaler doses regularly.',
        prescribed_at: new Date(Date.now() - 4 * 24 * 3600000),
        diagnosis: 'Mild Persistent Asthma',
        follow_up_date: '2026-08-20',
        status: 'Active',
        created_at: new Date(Date.now() - 4 * 24 * 3600000),
        updated_at: new Date(Date.now() - 4 * 24 * 3600000)
      },
      {
        id: 3,
        patient_id: 14,
        doctor_id: 6,
        clinical_notes: 'Maintain strict carbohydrate restriction. Take Metformin after meals.',
        prescribed_at: new Date(Date.now() - 5 * 24 * 3600000),
        diagnosis: 'Type 2 Diabetes Mellitus',
        follow_up_date: '2026-09-01',
        status: 'Active',
        created_at: new Date(Date.now() - 5 * 24 * 3600000),
        updated_at: new Date(Date.now() - 5 * 24 * 3600000)
      },
      {
        id: 4,
        patient_id: 15,
        doctor_id: 7,
        clinical_notes: 'Take daily multivitamin supplements to resolve systemic fatigue.',
        prescribed_at: new Date(Date.now() - 10 * 24 * 3600000),
        diagnosis: 'Vitamin D Deficiency',
        follow_up_date: '2026-10-15',
        status: 'Active',
        created_at: new Date(Date.now() - 10 * 24 * 3600000),
        updated_at: new Date(Date.now() - 10 * 24 * 3600000)
      },
      {
        id: 5,
        patient_id: 16,
        doctor_id: 8,
        clinical_notes: 'Discontinued previous medication due to allergy spikes. Prescribed alternative antihistamine.',
        prescribed_at: new Date(Date.now() - 15 * 24 * 3600000),
        diagnosis: 'Seasonal Allergic Rhinitis',
        follow_up_date: null,
        status: 'Discontinued',
        created_at: new Date(Date.now() - 15 * 24 * 3600000),
        updated_at: new Date(Date.now() - 12 * 24 * 3600000)
      }
    ];

    await queryInterface.bulkInsert('prescriptions', prescriptions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('prescriptions', null, {});
  }
};
