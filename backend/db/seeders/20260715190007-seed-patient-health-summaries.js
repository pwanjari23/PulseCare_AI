'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const summaries = [];
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];

    // Seed health summaries for patients 12 to 36
    for (let patientId = 12; patientId <= 36; patientId++) {
      // Determine health score and risk level based on indexes
      let healthScore = 95 - (patientId % 5) * 6; // range 65 to 95
      let riskLevel = 'Low';

      if (healthScore < 70) {
        riskLevel = 'Critical';
      } else if (healthScore < 80) {
        riskLevel = 'High';
      } else if (healthScore < 90) {
        riskLevel = 'Medium';
      }

      summaries.push({
        patient_id: patientId,
        health_score: healthScore,
        risk_level: riskLevel,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('patient_health_summaries', summaries, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('patient_health_summaries', null, {});
  }
};
