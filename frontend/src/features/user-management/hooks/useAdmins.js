/**
 * PulseCare AI - Custom hook to fetch admin users list
 */

import { useQuery } from '@tanstack/react-query';
import userApi from '../api/user.api';

export const ADMINS_QUERY_KEY = (params) => ['users', 'admins', params];

export const useAdmins = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ADMINS_QUERY_KEY(params),
    queryFn: () => userApi.getAdmins(params),
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default useAdmins;
