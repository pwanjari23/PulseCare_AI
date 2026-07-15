'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const logs = [];
    
    // Seed 2 logs per patient (IDs 12 to 36) -> 50 logs total
    // Log IDs will be 1 to 50
    let logId = 1;
    for (let patientId = 12; patientId <= 36; patientId++) {
      // Log 1: Baseline normal reading (2 days ago)
      logs.push({
        id: logId++,
        patient_id: patientId,
        heart_rate: 72 + (patientId % 5),
        systolic_bp: 118 + (patientId % 3),
        diastolic_bp: 78 + (patientId % 3),
        oxygen_level: 98.2,
        temperature: 98.6,
        weight: 70.0 + (patientId % 10) * 1.5,
        logged_at: new Date(Date.now() - 2 * 24 * 3600000),
        triage_status: 'Normal',
        respiratory_rate: 16,
        blood_glucose_mgdl: 95.00,
        blood_glucose_type: 'Fasting',
        pain_level: 1,
        sleep_hours: 7.5,
        symptoms: 'None',
        mood: 'Good',
        notes: 'Routine daily baseline logs.',
        source: 'Manual',
        created_at: new Date(Date.now() - 2 * 24 * 3600000),
        updated_at: new Date(Date.now() - 2 * 24 * 3600000)
      });

      // Log 2: Dynamic reading (12 hours ago) - some are abnormal
      let heartRate = 75;
      let systolicBp = 120;
      let diastolicBp = 80;
      let oxygenLevel = 98.5;
      let temperature = 98.4;
      let bloodGlucoseMgdl = 110.00;
      let bloodGlucoseType = 'Post-Meal';
      let triageStatus = 'Normal';
      let notes = 'Vitals logged before work.';
      let painLevel = null;
      let symptoms = null;

      if (patientId === 12) {
        // High Blood Pressure Alert
        systolicBp = 152;
        diastolicBp = 98;
        triageStatus = 'Critical';
        notes = 'Feeling mild headache and dizziness.';
        symptoms = 'Headache, Dizziness';
        painLevel = 3;
      } else if (patientId === 13) {
        // Low SpO2 Alert
        oxygenLevel = 91.0;
        triageStatus = 'Critical';
        notes = 'Slight shortness of breath while resting.';
        symptoms = 'Shortness of Breath';
        painLevel = 2;
      } else if (patientId === 14) {
        // High Blood Glucose
        bloodGlucoseMgdl = 280.00;
        bloodGlucoseType = 'Random';
        triageStatus = 'Critical';
        notes = 'Increased thirst and fatigue today.';
        symptoms = 'Fatigue, Increased Thirst';
      } else if (patientId === 15) {
        // Tachycardia
        heartRate = 115;
        triageStatus = 'Warning';
        notes = 'Elevated pulse rate after mild walking.';
        symptoms = 'Palpitations';
      }

      logs.push({
        id: logId++,
        patient_id: patientId,
        heart_rate: heartRate,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        oxygen_level: oxygenLevel,
        temperature: temperature,
        weight: 70.0 + (patientId % 10) * 1.5,
        logged_at: new Date(Date.now() - 12 * 3600000),
        triage_status: triageStatus,
        respiratory_rate: 18,
        blood_glucose_mgdl: bloodGlucoseMgdl,
        blood_glucose_type: bloodGlucoseType,
        pain_level: painLevel,
        sleep_hours: 6.8,
        symptoms: symptoms,
        mood: triageStatus === 'Critical' ? 'Anxious' : 'Normal',
        notes: notes,
        source: patientId % 2 === 0 ? 'Bluetooth' : 'Manual',
        created_at: new Date(Date.now() - 12 * 3600000),
        updated_at: new Date(Date.now() - 12 * 3600000)
      });
    }

    await queryInterface.bulkInsert('vitals_logs', logs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vitals_logs', null, {});
  }
};
