import { useQuery } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';

export const usePatientDoctorNotes = (patientId, params) => {
  return useQuery({
    queryKey: ['doctor-notes', 'patient', patientId, params],
    queryFn: () => {
      if (patientId) {
        return doctorNoteApi.getPatientNotesForAdmin(patientId, params);
      }
      return doctorNoteApi.getPatientNotes(params);
    },
    enabled: true,
  });
};

export default usePatientDoctorNotes;
