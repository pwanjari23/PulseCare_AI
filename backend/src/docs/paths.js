/**
 * PulseCare AI Backend API – Complete OpenAPI 3.0 Path Declarations
 */

module.exports = {
  // ── Authentication ──────────────────────────────────────────────────────────
  '/auth/register/patient': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new Patient',
      description: 'Creates a patient profile and associated user account.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterPatientRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Patient registered successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
        400: {
          description: 'Validation failed or email already registered.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
  '/auth/register/doctor': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new Doctor',
      description: 'Submits a registration request for a doctor profile.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterDoctorRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Registration request submitted.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
        400: {
          description: 'Validation failed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User Login',
      description: 'Authenticates user and returns access and refresh tokens.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Login successful' },
                  data: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string', example: 'eyJhbGci...' },
                      refreshToken: { type: 'string', example: 'eyJhbGci...' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          email: { type: 'string', example: 'patient@example.com' },
                          role: { type: 'string', example: 'Patient' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh Access Token',
      description: 'Generates a new access token using a valid refresh token.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Token refreshed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
        401: {
          description: 'Invalid or expired refresh token.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'User Logout',
      description: 'Revokes the refresh token and logs user out.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Logged out successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/password-reset/forgot': {
    post: {
      tags: ['Authentication'],
      summary: 'Request Password Reset',
      description: 'Triggers a password recovery instructions email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Instructions sent (or ignored to prevent enumeration).',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'If an account with this email exists, password reset instructions have been sent.' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/password-reset/reset': {
    post: {
      tags: ['Authentication'],
      summary: 'Execute Password Reset',
      description: 'Resets the user password and revokes all active refresh token sessions.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset completed.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Password reset successfully.' },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid, expired token, or passwords mismatched.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },

  // ── Doctors ──────────────────────────────────────────────────────────────────
  '/doctors/me': {
    get: {
      tags: ['Doctors'],
      summary: "Get Doctor's Own Profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Profile retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Doctor' },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Doctors'],
      summary: "Update Doctor's Own Profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateDoctorProfileRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Doctor' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/doctors/{id}': {
    get: {
      tags: ['Doctors'],
      summary: 'Get Doctor Public Profile',
      description: 'Public profile accessible to patients.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Public profile retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Doctor' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/admin/doctors/{id}': {
    get: {
      tags: ['Doctors'],
      summary: 'Admin View Doctor Profile',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Detailed doctor profile retrieved for administrator.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Doctor' },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Patients ─────────────────────────────────────────────────────────────────
  '/patients/me': {
    get: {
      tags: ['Patients'],
      summary: "Get Patient's Own Profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Profile retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Patients'],
      summary: "Update Patient's Own Profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePatientProfileRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/patients/doctor/{id}': {
    get: {
      tags: ['Patients'],
      summary: 'Doctor View Patient Profile',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Clinical profile retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/patients/admin/{id}': {
    get: {
      tags: ['Patients'],
      summary: 'Admin View Patient Profile',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Patient profile retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Appointments ─────────────────────────────────────────────────────────────
  '/appointments': {
    post: {
      tags: ['Appointments'],
      summary: 'Book Appointment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BookAppointmentRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Appointment booked.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Appointment' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/appointments/me': {
    get: {
      tags: ['Appointments'],
      summary: 'Patient Appointments',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Patient booking list.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Appointment' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/appointments/doctor': {
    get: {
      tags: ['Appointments'],
      summary: 'Doctor Appointments',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Doctor calendar list.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Appointment' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/appointments/{id}': {
    get: {
      tags: ['Appointments'],
      summary: 'Appointment Details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Appointment data retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Appointment' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/appointments/{id}/cancel': {
    patch: {
      tags: ['Appointments'],
      summary: 'Cancel Appointment',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                reason: { type: 'string', example: 'Conflict schedule' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Appointment cancelled.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/appointments/{id}/complete': {
    patch: {
      tags: ['Appointments'],
      summary: 'Complete Appointment',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CompleteAppointmentRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Appointment completed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },

  // ── Vitals ───────────────────────────────────────────────────────────────────
  '/vitals': {
    post: {
      tags: ['Vitals'],
      summary: 'Record Vitals',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RecordVitalRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Vital sign logged.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Vital' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/vitals/me': {
    get: {
      tags: ['Vitals'],
      summary: 'Patient Vitals History',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Logs list.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Vital' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/vitals/latest': {
    get: {
      tags: ['Vitals'],
      summary: 'Patient Latest Vitals',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Latest vital sign.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Vital' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/vitals/{id}': {
    put: {
      tags: ['Vitals'],
      summary: 'Update Vitals',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RecordVitalRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Vitals updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Vital' },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Vitals'],
      summary: 'Delete Vitals',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Vitals deleted.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/vitals/patient/{id}': {
    get: {
      tags: ['Vitals'],
      summary: 'Doctor Access Patient Vitals',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Vitals logs history.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Vital' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Availability ─────────────────────────────────────────────────────────────
  '/availability': {
    post: {
      tags: ['Availability'],
      summary: 'Create Availability Schedule',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAvailabilityRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Availability created.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Availability' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/availability/me': {
    get: {
      tags: ['Availability'],
      summary: 'Get Doctor Own Availability',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of availability blocks.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Availability' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/availability/{id}': {
    put: {
      tags: ['Availability'],
      summary: 'Update Availability Block',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAvailabilityRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Availability updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Availability' },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Availability'],
      summary: 'Delete Availability Block',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Availability deleted.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/availability/{id}/disable': {
    patch: {
      tags: ['Availability'],
      summary: 'Disable Availability Block',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Availability block disabled.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/availability/doctor/{doctorId}': {
    get: {
      tags: ['Availability'],
      summary: 'Get Public Doctor Availability',
      description: 'Used by patients to book slots.',
      parameters: [
        {
          name: 'doctorId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 2,
        },
      ],
      responses: {
        200: {
          description: 'Public list of active availability blocks.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Availability' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Notifications ────────────────────────────────────────────────────────────
  '/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'List Notifications',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Notifications list.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/notifications/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Unread Notifications Count',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Unread count payload.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      count: { type: 'integer', example: 3 },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/notifications/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark All Notifications Read',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'All notifications marked read.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/notifications/{id}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark One Notification Read',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Notification marked read.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
  '/notifications/user/{userId}': {
    get: {
      tags: ['Notifications'],
      summary: 'Admin View User Notifications',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'User notification list for administrator.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Prescriptions ────────────────────────────────────────────────────────────
  '/prescriptions': {
    post: {
      tags: ['Prescriptions'],
      summary: 'Create Prescription',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePrescriptionRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Prescription created.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Prescription' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/prescriptions/me': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Doctor Prescriptions List',
      description: 'List all prescriptions issued by the authenticated doctor.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of doctor prescriptions.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Prescription' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/prescriptions/patient': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Patient Prescriptions List',
      description: 'List all prescriptions issued to the authenticated patient.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of patient prescriptions.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Prescription' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/prescriptions/{id}': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get Prescription Details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Prescription details retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Prescription' },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Prescriptions'],
      summary: 'Update Prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePrescriptionRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Prescription updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Prescription' },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Doctor Notes ─────────────────────────────────────────────────────────────
  '/doctor-notes': {
    post: {
      tags: ['Doctor Notes'],
      summary: 'Create Doctor Note',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateDoctorNoteRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Doctor note created.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/DoctorNote' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/doctor-notes/me': {
    get: {
      tags: ['Doctor Notes'],
      summary: 'Doctor Own Notes List',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of doctor notes.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/DoctorNote' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/doctor-notes/admin/patient/{patientId}': {
    get: {
      tags: ['Doctor Notes'],
      summary: 'Admin View Patient Notes List',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Full list of patient notes for administrator.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/DoctorNote' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/doctor-notes/{id}': {
    get: {
      tags: ['Doctor Notes'],
      summary: 'Get Doctor Note Details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Doctor note retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/DoctorNote' },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Doctor Notes'],
      summary: 'Update Doctor Note',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateDoctorNoteRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Doctor note updated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/DoctorNote' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/doctor-notes/{id}/archive': {
    patch: {
      tags: ['Doctor Notes'],
      summary: 'Archive Doctor Note',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Doctor note archived successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },

  // ── AI Health Summary ────────────────────────────────────────────────────────
  '/health-summary/me': {
    get: {
      tags: ['AI'],
      summary: 'Get Patient Own Summary',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'AI Generated Health Summary.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string', example: 'Your health state is stable based on recent vitals.' },
                      generatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/health-summary/patient/{patientId}': {
    get: {
      tags: ['AI'],
      summary: 'Get Patient Summary for Doctor/Admin',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'AI Summary data retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string', example: 'Patient displays borderline hypertension.' },
                      generatedAt: { type: 'string', format: 'date-time', example: '2026-07-16T12:00:00Z' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Dashboard ────────────────────────────────────────────────────────────────
  '/dashboard/patient': {
    get: {
      tags: ['Dashboard'],
      summary: 'Patient Dashboard Metrics',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Patient metrics retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/PatientDashboard' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/dashboard/doctor': {
    get: {
      tags: ['Dashboard'],
      summary: 'Doctor Dashboard Metrics',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Doctor metrics retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/DoctorDashboard' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/dashboard/admin': {
    get: {
      tags: ['Dashboard'],
      summary: 'Admin Dashboard Metrics',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Admin metrics retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/AdminDashboard' },
                },
              },
            },
          },
        },
      },
    },
  },

  // ── Upload ───────────────────────────────────────────────────────────────────
  '/upload/profile-image': {
    post: {
      tags: ['Uploads'],
      summary: 'Upload Profile Image',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'The profile image file (JPG, PNG, GIF, max 2MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Uploaded successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/doctor-document': {
    post: {
      tags: ['Uploads'],
      summary: 'Upload Doctor License/Document',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'PDF, JPG, PNG license documentation (max 5MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Document uploaded.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/prescription': {
    post: {
      tags: ['Uploads'],
      summary: 'Upload Prescription File',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'PDF, JPG, PNG prescription file (max 5MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Prescription uploaded.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/medical-report': {
    post: {
      tags: ['Uploads'],
      summary: 'Upload Patient Medical Report',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'PDF, JPG, PNG report file (max 10MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Medical report uploaded.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/lab-report': {
    post: {
      tags: ['Uploads'],
      summary: 'Upload Patient Lab Report',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'PDF, JPG, PNG lab results file (max 10MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Lab report uploaded.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/my-files': {
    get: {
      tags: ['Uploads'],
      summary: 'Get Authenticated User Files',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'category',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['PROFILE_IMAGE', 'DOCTOR_DOCUMENT', 'PRESCRIPTION', 'MEDICAL_REPORT', 'LAB_REPORT'],
          },
          example: 'PROFILE_IMAGE',
        },
      ],
      responses: {
        200: {
          description: 'List of uploaded files.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UploadedFile' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/upload/{uuid}': {
    get: {
      tags: ['Uploads'],
      summary: 'Get Single File Details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'uuid',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        },
      ],
      responses: {
        200: {
          description: 'File metadata retrieved.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/UploadedFile' },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Uploads'],
      summary: 'Delete Uploaded File',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'uuid',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        },
      ],
      responses: {
        200: {
          description: 'File deleted from local disk and database record removed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
            },
          },
        },
      },
    },
  },
};
