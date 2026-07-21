import { useQuery } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

export const usePatientPrescriptions = (patientId, params) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESCRIPTIONS, 'patient', patientId, params],
    queryFn: () => {
      if (patientId) {
        return prescriptionApi.getPatientPrescriptionsByAdminDoctor(patientId, params);
      }
      return prescriptionApi.getPatientPrescriptions(params);
    },
    enabled: true,
  });
};

export default usePatientPrescriptions;
