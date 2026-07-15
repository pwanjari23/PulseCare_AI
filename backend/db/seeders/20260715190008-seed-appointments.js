'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const appointments = [];

    // 1. Seed 10 Completed Past Appointments
    for (let i = 1; i <= 10; i++) {
      const patientId = i + 11; // 12 - 21
      const doctorId = (i % 10) + 2; // 2 - 11
      appointments.push({
        id: i,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_at: new Date(Date.now() - i * 3 * 24 * 3600000), // days ago
        status: 'Completed',
        reason: 'Regular cardiological vitals review.',
        notes: 'Patient vitals are stabilized. Recommended continuing current medication regimen.',
        appointment_type: 'Online',
        meeting_link: `https://meet.jit.si/pulsecare-session-${i}`,
        cancellation_reason: null,
        rescheduled_from_id: null,
        duration_minutes: 30,
        created_at: new Date(Date.now() - 10 * 24 * 3600000),
        updated_at: new Date(Date.now() - i * 3 * 24 * 3600000)
      });
    }

    // 2. Seed 5 Scheduled Today's Appointments (IDs 11 - 15)
    for (let i = 1; i <= 5; i++) {
      const patientId = i + 21; // 22 - 26
      const doctorId = i + 1; // 2 - 6
      const appointmentTime = new Date();
      appointmentTime.setHours(9 + i, 0, 0, 0); // 10:00 to 14:00 today

      appointments.push({
        id: i + 10,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_at: appointmentTime,
        status: 'Scheduled',
        reason: 'Weekly blood sugar review.',
        notes: 'Reviewing metformin logs.',
        appointment_type: 'Online',
        meeting_link: `https://meet.jit.si/pulsecare-session-${i + 10}`,
        cancellation_reason: null,
        rescheduled_from_id: null,
        duration_minutes: 30,
        created_at: new Date(Date.now() - 2 * 24 * 3600000),
        updated_at: new Date(Date.now() - 2 * 24 * 3600000)
      });
    }

    // 3. Seed 5 Scheduled Upcoming Appointments (IDs 16 - 20)
    for (let i = 1; i <= 5; i++) {
      const patientId = i + 26; // 27 - 31
      const doctorId = i + 2; // 3 - 7
      appointments.push({
        id: i + 15,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_at: new Date(Date.now() + i * 2 * 24 * 3600000), // days in future
        status: 'Scheduled',
        reason: 'Routine checkup.',
        notes: 'Follow up on asthma recovery status.',
        appointment_type: 'Online',
        meeting_link: `https://meet.jit.si/pulsecare-session-${i + 15}`,
        cancellation_reason: null,
        rescheduled_from_id: null,
        duration_minutes: 30,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // 4. Seed 2 Cancelled Appointments (IDs 21 - 22)
    appointments.push({
      id: 21,
      patient_id: 32,
      doctor_id: 2,
      appointment_at: new Date(Date.now() - 1 * 24 * 3600000), // yesterday
      status: 'Cancelled',
      reason: 'Urgent consultation for blood pressure spikes.',
      notes: null,
      appointment_type: 'Offline',
      meeting_link: null,
      cancellation_reason: 'Patient resolved issues over phone.',
      rescheduled_from_id: null,
      duration_minutes: 30,
      created_at: new Date(Date.now() - 3 * 24 * 3600000),
      updated_at: new Date(Date.now() - 1 * 24 * 3600000)
    });
    appointments.push({
      id: 22,
      patient_id: 33,
      doctor_id: 3,
      appointment_at: new Date(Date.now() - 2 * 24 * 3600000),
      status: 'Cancelled',
      reason: 'Regular consultation.',
      notes: null,
      appointment_type: 'Online',
      meeting_link: null,
      cancellation_reason: 'Doctor had scheduling conflict.',
      rescheduled_from_id: null,
      duration_minutes: 30,
      created_at: new Date(Date.now() - 4 * 24 * 3600000),
      updated_at: new Date(Date.now() - 2 * 24 * 3600000)
    });

    await queryInterface.bulkInsert('appointments', appointments, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('appointments', null, {});
  }
};
