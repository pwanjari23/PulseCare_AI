import { useQuery } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';

export const useDoctorNote = (id) => {
  return useQuery({
    queryKey: ['doctor-notes', id],
    queryFn: () => doctorNoteApi.getNoteById(id),
    enabled: !!id,
  });
};

export default useDoctorNote;
