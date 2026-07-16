module.exports = {
  PatientDashboard: {
    type: 'object',
    properties: {
      nextAppointment: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'integer', example: 1 },
          scheduledAt: { type: 'string', format: 'date-time', example: '2026-08-20T10:00:00Z' },
          doctorName: { type: 'string', example: 'Jane Smith' }
        }
      },
      latestVitals: {
        type: 'object',
        nullable: true,
        properties: {
          bloodPressure: { type: 'string', example: '120/80' },
          heartRate: { type: 'integer', example: 72 },
          recordedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' }
        }
      },
      unreadNotificationsCount: { type: 'integer', example: 3 }
    }
  },
  DoctorDashboard: {
    type: 'object',
    properties: {
      todayAppointmentsCount: { type: 'integer', example: 5 },
      pendingRequestsCount: { type: 'integer', example: 2 },
      criticalAlertsCount: { type: 'integer', example: 1 },
      nextAppointment: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'integer', example: 2 },
          scheduledAt: { type: 'string', format: 'date-time', example: '2026-07-16T15:00:00Z' },
          patientName: { type: 'string', example: 'John Doe' }
        }
      }
    }
  },
  AdminDashboard: {
    type: 'object',
    properties: {
      totalPatients: { type: 'integer', example: 120 },
      totalDoctors: { type: 'integer', example: 15 },
      pendingDoctorApprovals: { type: 'integer', example: 3 },
      activeAppointmentsToday: { type: 'integer', example: 18 }
    }
  }
};
