import { useQuery } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

export const useVital = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, id],
    queryFn: () => vitalApi.getVitalById(id),
    enabled: !!id,
  });
};

export default useVital;
