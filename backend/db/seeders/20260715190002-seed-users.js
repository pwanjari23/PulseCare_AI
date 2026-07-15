'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = '$2a$10$.v4EbVtPS83kpPurdOtxpudDUZCcGXA855.DpTwRJXWwhXLpWpZnW'; // Hashed "Password@123"
    const users = [];

    // 1. Seed Admin User (ID 1)
    users.push({
      id: 1,
      email: 'admin@pulsecare.ai',
      password_hash: passwordHash,
      role: 'Admin',
      phone: '+15550100',
      status: 'Active',
      created_at: new Date(),
      updated_at: new Date()
    });

    // 2. Seed 10 Doctor Users (IDs 2 - 11)
    for (let i = 1; i <= 10; i++) {
      users.push({
        id: i + 1,
        email: `doctor${i}@pulsecare.ai`,
        password_hash: passwordHash,
        role: 'Doctor',
        phone: `+1555020${i}`,
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // 3. Seed 25 Patient Users (IDs 12 - 36)
    for (let i = 1; i <= 25; i++) {
      users.push({
        id: i + 11,
        email: `patient${i}@pulsecare.ai`,
        password_hash: passwordHash,
        role: 'Patient',
        phone: `+155503${String(i).padStart(2, '0')}`,
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
