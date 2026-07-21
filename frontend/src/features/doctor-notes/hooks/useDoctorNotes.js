import { useQuery } from '@tanstack/react-query';
import { doctorNoteApi } from '../api/doctorNote.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const useDoctorNotes = (params) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();

  return useQuery({
    queryKey: ['doctor-notes', role, params],
    queryFn: () => {
      if (role === ROLES.DOCTOR.toLowerCase()) {
        return doctorNoteApi.getDoctorNotes(params);
      }
      if (role === ROLES.PATIENT.toLowerCase()) {
        return doctorNoteApi.getPatientNotes(params);
      }
      return doctorNoteApi.getDoctorNotes(params).catch(() => []);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default useDoctorNotes;
