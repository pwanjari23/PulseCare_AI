import { useQuery } from '@tanstack/react-query';
import patientApi from '../api/patient.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const usePatient = (id) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();

  return useQuery({
    queryKey: [QUERY_KEYS.PATIENTS, id],
    queryFn: () => {
      if (!id || id === 'me' || role === 'patient') {
        return patientApi.getMyProfile();
      }
      if (role === 'doctor') {
        return patientApi.getPatientForDoctor(id);
      }
      return patientApi.getPatientForAdmin(id);
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });
};
