/**
 * PulseCare AI - Prescription Utility Functions
 */

/**
 * Format Date display
 */
export const formatPrescriptionDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Calculate expiration status based on prescribedAt and duration
 */
export const isPrescriptionExpired = (prescribedAt, durationDays = 7) => {
  if (!prescribedAt) return false;
  const start = new Date(prescribedAt);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return new Date() > end;
};

/**
 * Generate Prescription Reference Number
 */
export const generatePrescriptionCode = (id) => {
  if (!id) return 'RX-PENDING';
  return `RX-${String(id).padStart(6, '0')}`;
};

/**
 * Filter Prescriptions list by search, status, and date filter
 */
export const filterPrescriptions = (prescriptions = [], { search = '', status = 'all' } = {}) => {
  let result = [...prescriptions];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter((p) => {
      const rxCode = generatePrescriptionCode(p.id).toLowerCase();
      const docName = `${p.doctor?.user?.firstName || p.doctor?.firstName || ''} ${p.doctor?.user?.lastName || p.doctor?.lastName || ''}`.toLowerCase();
      const patName = `${p.patient?.firstName || ''} ${p.patient?.lastName || ''}`.toLowerCase();
      const diagnosis = (p.diagnosis || '').toLowerCase();
      const medNames = (p.items || []).map((i) => (i.medicationName || '').toLowerCase()).join(' ');

      return rxCode.includes(q) || docName.includes(q) || patName.includes(q) || diagnosis.includes(q) || medNames.includes(q);
    });
  }

  if (status && status !== 'all') {
    result = result.filter((p) => (p.status || 'Active').toLowerCase() === status.toLowerCase());
  }

  return result;
};
