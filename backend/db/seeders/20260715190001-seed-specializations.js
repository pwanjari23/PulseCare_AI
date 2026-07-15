'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const specializations = [
      { id: 1, name: 'Cardiologist', description: 'Specialist in heart diseases and cardiovascular health.', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'General Physician', description: 'Primary care doctor for general health concerns.', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Diabetologist', description: 'Endocrinologist specializing in diabetes mellitus tracking.', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Neurologist', description: 'Specialist in nervous system and brain conditions.', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'Orthopedic', description: 'Specialist in bone, joint, and muscle health.', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'Pulmonologist', description: 'Specialist in lung diseases and respiratory health.', created_at: new Date(), updated_at: new Date() },
      { id: 7, name: 'Dermatologist', description: 'Specialist in skin conditions and dermatology health.', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: 'Psychiatrist', description: 'Specialist in mental health and behavioral disorders.', created_at: new Date(), updated_at: new Date() },
      { id: 9, name: 'Gynecologist', description: 'Specialist in female reproductive health and pregnancy.', created_at: new Date(), updated_at: new Date() },
      { id: 10, name: 'Pediatrician', description: 'Specialist in medical care for infants, children, and adolescents.', created_at: new Date(), updated_at: new Date() }
    ];

    await queryInterface.bulkInsert('specializations', specializations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('specializations', null, {});
  }
};
