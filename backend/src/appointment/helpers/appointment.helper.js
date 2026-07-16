/**
 * Validates whether a state transition is permitted for an appointment.
 * Permitted transitions:
 * - Pending -> Confirmed -> Completed
 * - Pending -> Cancelled
 * - Confirmed -> Cancelled
 *
 * For backward compatibility with seeded data:
 * - Scheduled is treated similarly to Confirmed (transitions to Completed or Cancelled).
 *
 * @param {string} currentStatus - Current status in the database
 * @param {string} newStatus - Requested status
 * @returns {boolean} True if transition is valid, false otherwise
 */
const validateAppointmentTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true;

  if (currentStatus === 'Pending') {
    return newStatus === 'Confirmed' || newStatus === 'Cancelled';
  }

  if (currentStatus === 'Confirmed' || currentStatus === 'Scheduled') {
    return newStatus === 'Completed' || newStatus === 'Cancelled';
  }

  return false;
};

module.exports = {
  validateAppointmentTransition
};
