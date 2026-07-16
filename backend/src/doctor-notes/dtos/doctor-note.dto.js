/**
 * DTO mapper for Doctor Note
 */
function toDoctorNoteDto(note) {
  if (!note) return null;
  
  return {
    id: Number(note.id),
    doctorId: Number(note.doctorId),
    patientId: Number(note.patientId),
    appointmentId: note.appointmentId ? Number(note.appointmentId) : null,
    title: note.title,
    note: note.noteContent,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}

module.exports = {
  toDoctorNoteDto
};
