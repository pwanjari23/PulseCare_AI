import { useQuery } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

export const usePatientVitals = (patientId, params) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, 'patient', patientId, params],
    queryFn: () => vitalApi.getPatientVitals(patientId, params),
    enabled: !!patientId,
  });
};

export default usePatientVitals;
