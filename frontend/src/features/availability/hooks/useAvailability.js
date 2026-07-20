import { useQuery } from '@tanstack/react-query';
import availabilityApi from '../api/availability.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';
import { AVAILABILITY_STALE_TIME } from '../constants/availability.constants';

/**
 * Fetches the authenticated doctor's own availability schedule.
 */
export const useAvailability = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABILITY, 'me'],
    queryFn: () => availabilityApi.getMyAvailability(),
    enabled: !!user && user.role?.toLowerCase() === 'doctor',
    staleTime: AVAILABILITY_STALE_TIME,
    select: (data) => {
      // Backend may return { availability: [...] } or a direct array
      if (Array.isArray(data)) return data;
      if (data?.availability) return data.availability;
      return [];
    },
  });
};

export default useAvailability;
