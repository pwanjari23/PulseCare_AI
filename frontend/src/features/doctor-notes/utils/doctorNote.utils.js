/**
 * PulseCare AI - Doctor Notes Utility Functions
 */

/**
 * Format date display
 */
export const formatNoteDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate Note Reference Code
 */
export const generateNoteCode = (id) => {
  if (!id) return 'NOTE-PENDING';
  return `NOTE-${String(id).padStart(6, '0')}`;
};

/**
 * Filter Doctor Notes list
 */
export const filterDoctorNotes = (notes = [], { search = '', status = 'all' } = {}) => {
  let result = [...notes];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter((n) => {
      const code = generateNoteCode(n.id).toLowerCase();
      const title = (n.title || '').toLowerCase();
      const content = (n.noteContent || '').toLowerCase();
      const docName = `${n.doctor?.user?.firstName || n.doctor?.firstName || ''} ${n.doctor?.user?.lastName || n.doctor?.lastName || ''}`.toLowerCase();
      const patName = `${n.patient?.firstName || ''} ${n.patient?.lastName || ''}`.toLowerCase();

      return code.includes(q) || title.includes(q) || content.includes(q) || docName.includes(q) || patName.includes(q);
    });
  }

  if (status && status !== 'all') {
    result = result.filter((n) => {
      if (status === 'archived') return n.isArchived;
      if (status === 'completed') return !n.isArchived;
      return true;
    });
  }

  return result;
};

/**
 * Parses structured sections from composite note content if present, or formats it cleanly
 */
export const parseNoteContentSections = (content = '') => {
  if (!content) return { body: '' };
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {
    // Plain text content fallback
  }
  return { body: content };
};
