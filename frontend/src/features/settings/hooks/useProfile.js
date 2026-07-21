/**
 * PulseCare AI - Custom hook to fetch user profile
 */

import { useQuery } from '@tanstack/react-query';
import settingsApi from '../api/settings.api';

export const PROFILE_QUERY_KEY = ['settings', 'profile'];

export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => settingsApi.getProfile(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useProfile;
