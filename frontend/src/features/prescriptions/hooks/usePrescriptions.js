import { useQuery } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const usePrescriptions = (params) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();

  return useQuery({
    queryKey: [QUERY_KEYS.PRESCRIPTIONS, role, params],
    queryFn: () => {
      if (role === ROLES.DOCTOR.toLowerCase()) {
        return prescriptionApi.getDoctorPrescriptions(params);
      }
      if (role === ROLES.PATIENT.toLowerCase()) {
        return prescriptionApi.getPatientPrescriptions(params);
      }
      return prescriptionApi.getDoctorPrescriptions(params).catch(() => []);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default usePrescriptions;
