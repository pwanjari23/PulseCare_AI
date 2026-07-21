import { useQuery } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

export const usePrescription = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESCRIPTIONS, id],
    queryFn: () => prescriptionApi.getPrescriptionById(id),
    enabled: !!id,
  });
};

export default usePrescription;
