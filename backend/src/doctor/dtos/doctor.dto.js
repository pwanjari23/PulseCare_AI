/**
 * Maps a Sequelize doctor instance and associated user to the Private Doctor DTO.
 * Excludes sensitive fields (e.g. password hash, timestamps, internal foreign keys).
 * @param {object} doctor - Sequelize Doctor instance
 * @param {object} user - Associated Sequelize User instance
 * @returns {object} Private Doctor DTO
 */
const toPrivateDoctorDto = (doctor, user) => {
  if (!doctor) return null;

  return {
    id: doctor.id,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: user ? user.email : (doctor.user ? doctor.user.email : null),
    specialization: doctor.specialization ? doctor.specialization.name : null,
    clinicName: doctor.clinicName,
    clinicAddress: doctor.clinicAddress,
    clinicZip: doctor.clinicZip,
    experienceYears: doctor.experienceYears,
    consultationFee: doctor.consultationFee,
    languages: doctor.languages || [],
    bio: doctor.bio,
    profileImage: doctor.profilePhotoUrl,
    profileCompletionPercentage: doctor.profileCompletionPct || 0,
    isVerified: doctor.isVerified,
    status: user ? user.status : (doctor.user ? doctor.user.status : null)
  };
};

/**
 * Maps a Sequelize doctor instance to the Public Doctor DTO.
 * Excludes licenseNumber, email, phone, isVerified, etc.
 * @param {object} doctor - Sequelize Doctor instance
 * @returns {object} Public Doctor DTO
 */
const toPublicDoctorDto = (doctor) => {
  if (!doctor) return null;

  return {
    id: doctor.id,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    specialization: doctor.specialization ? doctor.specialization.name : null,
    experienceYears: doctor.experienceYears,
    consultationFee: doctor.consultationFee,
    clinicName: doctor.clinicName,
    languages: doctor.languages || [],
    bio: doctor.bio,
    profileImage: doctor.profilePhotoUrl
  };
};

module.exports = {
  toPrivateDoctorDto,
  toPublicDoctorDto
};
