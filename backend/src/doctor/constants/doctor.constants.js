/**
 * Fields evaluated to calculate profile completion percentage.
 * If any of these fields are non-null and non-empty, they are counted.
 */
const PROFILE_COMPLETION_FIELDS = [
  'specializationId',
  'bio',
  'experienceYears',
  'consultationFee',
  'clinicName',
  'clinicAddress',
  'clinicZip',
  'languages',
  'profilePhotoUrl'
];

module.exports = {
  PROFILE_COMPLETION_FIELDS
};
