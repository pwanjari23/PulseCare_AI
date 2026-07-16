const swaggerJSDoc = require('swagger-jsdoc');

// Core schemas
const ApiResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Operation completed successfully.' },
    data: { type: 'object', nullable: true, example: null },
  },
};

const ApiError = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Validation failed.' },
    errors: { type: 'array', items: { type: 'object' }, example: [{ msg: 'Invalid email format' }] },
    stack: { type: 'string', example: 'Error: Validation failed\n    at...' },
  },
};

const Pagination = {
  type: 'object',
  properties: {
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 10 },
    total: { type: 'integer', example: 50 },
    totalPages: { type: 'integer', example: 5 },
  },
};

// Import component schemas
const authSchemas = require('./schemas/auth.schema');
const doctorSchemas = require('./schemas/doctor.schema');
const patientSchemas = require('./schemas/patient.schema');
const appointmentSchemas = require('./schemas/appointment.schema');
const vitalSchemas = require('./schemas/vital.schema');
const availabilitySchemas = require('./schemas/availability.schema');
const notificationSchemas = require('./schemas/notification.schema');
const prescriptionSchemas = require('./schemas/prescription.schema');
const doctorNoteSchemas = require('./schemas/doctor-note.schema');
const dashboardSchemas = require('./schemas/dashboard.schema');
const uploadSchemas = require('./schemas/upload.schema');

// Combine all component schemas
const combinedSchemas = {
  ApiResponse,
  ApiError,
  Pagination,
  ...authSchemas,
  ...doctorSchemas,
  ...patientSchemas,
  ...appointmentSchemas,
  ...vitalSchemas,
  ...availabilitySchemas,
  ...notificationSchemas,
  ...prescriptionSchemas,
  ...doctorNoteSchemas,
  ...dashboardSchemas,
  ...uploadSchemas,
};

// Import paths
const paths = require('./paths');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PulseCare AI Backend API',
    description: 'Production Ready Remote Patient Monitoring API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:5050/api/v1',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: combinedSchemas,
  },
  paths,
};

const options = {
  swaggerDefinition,
  apis: [], // Paths are defined programmatically above
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
