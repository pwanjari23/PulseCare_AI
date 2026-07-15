'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const logs = [
      {
        user_id: 12,
        action: 'USER_LOGIN',
        module: 'Authentication',
        entity: 'User',
        entity_id: 12,
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        created_at: new Date(Date.now() - 3 * 24 * 3600000)
      },
      {
        user_id: 12,
        action: 'SUBMIT_VITALS',
        module: 'VitalsLogs',
        entity: 'VitalsLog',
        entity_id: 2,
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        created_at: new Date(Date.now() - 12 * 3600000)
      },
      {
        user_id: 4,
        action: 'DOCTOR_LOGIN',
        module: 'Authentication',
        entity: 'User',
        entity_id: 4,
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/15.6.1',
        created_at: new Date(Date.now() - 2 * 24 * 3600000)
      },
      {
        user_id: 4,
        action: 'ISSUE_PRESCRIPTION',
        module: 'Prescriptions',
        entity: 'Prescription',
        entity_id: 1,
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/15.6.1',
        created_at: new Date(Date.now() - 3 * 24 * 3600000)
      },
      {
        user_id: 13,
        action: 'USER_LOGIN',
        module: 'Authentication',
        entity: 'User',
        entity_id: 13,
        ip_address: '172.16.2.20',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15',
        created_at: new Date(Date.now() - 4 * 24 * 3600000)
      }
    ];

    await queryInterface.bulkInsert('activity_logs', logs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('activity_logs', null, {});
  }
};
