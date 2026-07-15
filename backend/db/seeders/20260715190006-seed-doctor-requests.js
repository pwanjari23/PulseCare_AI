'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const requests = [];

    // 1. Seed Accepted Requests (For patients 12 to 31 who have primary doctors)
    for (let i = 12; i <= 31; i++) {
      const primaryDoctorId = (i % 10) + 2;
      requests.push({
        patient_id: i,
        doctor_id: primaryDoctorId,
        status: 'Accepted',
        notes: 'Requesting primary linkage for remote diabetes monitoring.',
        resolved_at: new Date(Date.now() - 5 * 24 * 3600000), // 5 days ago
        created_at: new Date(Date.now() - 6 * 24 * 3600000),
        updated_at: new Date(Date.now() - 5 * 24 * 3600000)
      });
    }

    // 2. Seed Pending Requests (For patients 32, 33, 34)
    requests.push({
      patient_id: 32,
      doctor_id: 2,
      status: 'Pending',
      notes: 'Pls accept my connection request, need heart rate tracking.',
      resolved_at: null,
      created_at: new Date(Date.now() - 12 * 3600000), // 12 hours ago
      updated_at: new Date(Date.now() - 12 * 3600000)
    });
    requests.push({
      patient_id: 33,
      doctor_id: 3,
      status: 'Pending',
      notes: 'Recently diagnosed with asthma. Requesting pulmonologist tracking.',
      resolved_at: null,
      created_at: new Date(Date.now() - 6 * 3600000), // 6 hours ago
      updated_at: new Date(Date.now() - 6 * 3600000)
    });

    // 3. Seed Rejected Requests (For patient 35)
    requests.push({
      patient_id: 35,
      doctor_id: 5,
      status: 'Rejected',
      notes: 'Need orthopedic supervision after knee replacement.',
      resolved_at: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
      created_at: new Date(Date.now() - 3 * 24 * 3600000),
      updated_at: new Date(Date.now() - 2 * 24 * 3600000)
    });

    await queryInterface.bulkInsert('doctor_requests', requests, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctor_requests', null, {});
  }
};
