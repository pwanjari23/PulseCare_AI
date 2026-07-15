'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notes = [
      {
        patient_id: 12, // John Doe
        doctor_id: 4, // Dr. Robert Chen
        note_content: 'Patient John Doe reports mild headache. Systolic BP was elevated at 152. Advised to restrict sodium intake and rest. Scheduled follow up call.',
        created_at: new Date(Date.now() - 11 * 3600000),
        updated_at: new Date(Date.now() - 11 * 3600000)
      },
      {
        patient_id: 13, // Jane Johnson
        doctor_id: 5, // Dr. Elena Rostova
        note_content: 'Patient Jane Johnson exhibits moderate asthma trigger response during hot weather. Emphasized daily corticosteroid inhaler adherence.',
        created_at: new Date(Date.now() - 3 * 24 * 3600000),
        updated_at: new Date(Date.now() - 3 * 24 * 3600000)
      }
    ];

    await queryInterface.bulkInsert('doctor_notes', notes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctor_notes', null, {});
  }
};
