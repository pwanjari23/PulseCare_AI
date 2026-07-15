'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const availabilities = [];

    // Seed weekly schedules for Doctors (IDs 2 - 11)
    // Weekdays are 1 (Monday) to 5 (Friday)
    for (let doctorId = 2; doctorId <= 11; doctorId++) {
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        availabilities.push({
          doctor_id: doctorId,
          day_of_week: dayOfWeek,
          start_time: '09:00:00',
          end_time: '17:00:00',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('doctor_availabilities', availabilities, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctor_availabilities', null, {});
  }
};
