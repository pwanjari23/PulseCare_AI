/**
 * Fields evaluated to calculate patient profile completion percentage.
 * If any of these fields are non-null and non-empty, they are counted.
 */
const PATIENT_COMPLETION_FIELDS = [
  'firstName',
  'lastName',
  'gender',
  'dateOfBirth',
  'bloodType',
  'zipCode',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelation',
  'heightCm',
  'weightKg',
  'allergies',
  'medicalConditions',
  'smokingStatus',
  'alcoholConsumption'
];

module.exports = {
  PATIENT_COMPLETION_FIELDS
};
