const { Prescription, PrescriptionItem, Doctor, Patient, Specialization, Appointment } = require('#models/index.js');

/**
 * Finds a prescription by primary key, including all associations.
 */
const findPrescriptionById = async (id, transaction) => {
  return Prescription.findByPk(id, {
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      },
      { model: Patient, as: 'patient' },
      { model: PrescriptionItem, as: 'items' }
    ],
    transaction
  });
};

/**
 * Finds a prescription scoped to a specific doctor (ownership check).
 */
const findDoctorPrescription = async (doctorId, prescriptionId, transaction) => {
  return Prescription.findOne({
    where: { id: prescriptionId, doctorId },
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      },
      { model: Patient, as: 'patient' },
      { model: PrescriptionItem, as: 'items' }
    ],
    transaction
  });
};

/**
 * Finds all prescriptions for a patient, ordered newest-first.
 */
const findPatientPrescriptions = async (patientId, transaction) => {
  return Prescription.findAll({
    where: { patientId },
    order: [['prescribed_at', 'DESC']],
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      },
      { model: PrescriptionItem, as: 'items' }
    ],
    transaction
  });
};

/**
 * Finds all prescriptions issued by a doctor, ordered newest-first.
 */
const findDoctorPrescriptions = async (doctorId, transaction) => {
  return Prescription.findAll({
    where: { doctorId },
    order: [['prescribed_at', 'DESC']],
    include: [
      { model: Patient, as: 'patient' },
      { model: PrescriptionItem, as: 'items' }
    ],
    transaction
  });
};

/**
 * Creates a prescription record.
 */
const createPrescription = async (data, transaction) => {
  return Prescription.create(data, { transaction });
};

/**
 * Bulk-creates prescription item records.
 */
const createPrescriptionItems = async (items, transaction) => {
  return PrescriptionItem.bulkCreate(items, { transaction });
};

/**
 * Updates prescription fields.
 */
const updatePrescription = async (id, data, transaction) => {
  return Prescription.update(data, { where: { id }, transaction });
};

/**
 * Deletes all prescription items for a given prescription (for item replacement on update).
 */
const deletePrescriptionItems = async (prescriptionId, transaction) => {
  return PrescriptionItem.destroy({ where: { prescriptionId }, transaction });
};

module.exports = {
  findPrescriptionById,
  findDoctorPrescription,
  findPatientPrescriptions,
  findDoctorPrescriptions,
  createPrescription,
  createPrescriptionItems,
  updatePrescription,
  deletePrescriptionItems
};
