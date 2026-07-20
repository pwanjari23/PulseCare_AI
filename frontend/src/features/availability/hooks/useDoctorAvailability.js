import { useQuery } from '@tanstack/react-query';
import availabilityApi from '../api/availability.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { AVAILABILITY_STALE_TIME } from '../constants/availability.constants';

/**
 * Fetches public availability schedule for any doctor by ID.
 * Used by patients when booking appointments.
 */
export const useDoctorAvailability = (doctorId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABILITY, 'doctor', doctorId],
    queryFn: () => availabilityApi.getDoctorAvailability(doctorId),
    enabled: !!doctorId,
    staleTime: AVAILABILITY_STALE_TIME,
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.availability) return data.availability;
      return [];
    },
  });
};

export default useDoctorAvailability;
