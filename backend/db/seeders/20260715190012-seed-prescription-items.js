'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const items = [
      {
        id: 1,
        prescription_id: 1, // Stage 1 Hypertension
        medication_name: 'Amlodipine Besylate',
        dosage: '5mg',
        frequency: 'Once daily (morning)',
        duration_days: 90,
        instructions: 'Take with or without food. Monitor blood pressure daily.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        prescription_id: 1,
        medication_name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily (bedtime)',
        duration_days: 90,
        instructions: 'Take before sleep. Report any dry persistent cough.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        prescription_id: 2, // Persistent Asthma
        medication_name: 'Albuterol HFA Inhaler',
        dosage: '90 mcg/actuation',
        frequency: '2 puffs every 4-6 hours as needed',
        duration_days: 30,
        instructions: 'Rinse mouth after each use. Use for acute shortness of breath.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        prescription_id: 3, // Type 2 Diabetes
        medication_name: 'Metformin Hydrochloride',
        dosage: '500mg',
        frequency: 'Twice daily (with breakfast and dinner)',
        duration_days: 180,
        instructions: 'Must take with meals to reduce gastrointestinal side effects.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        prescription_id: 3,
        medication_name: 'Atorvastatin Calcium',
        dosage: '20mg',
        frequency: 'Once daily (bedtime)',
        duration_days: 180,
        instructions: 'Helps control cholesterol levels. Report muscle soreness.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        prescription_id: 4, // Vitamin D Deficiency
        medication_name: 'Vitamin D3 (Cholecalciferol)',
        dosage: '50,000 IU',
        frequency: 'Once weekly',
        duration_days: 60,
        instructions: 'Take with a fat-containing meal for optimal absorption.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        prescription_id: 5, // Allergic Rhinitis (Discontinued)
        medication_name: 'Cetirizine Hydrochloride',
        dosage: '10mg',
        frequency: 'Once daily (evening)',
        duration_days: 14,
        instructions: 'Take in the evening. May cause mild drowsiness.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('prescription_items', items, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('prescription_items', null, {});
  }
};
