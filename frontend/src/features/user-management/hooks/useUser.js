/**
 * PulseCare AI - Custom hook to fetch a single user profile
 */

import { useQuery } from '@tanstack/react-query';
import userApi from '../api/user.api';

export const USER_DETAIL_QUERY_KEY = (id) => ['users', 'detail', String(id)];

export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: USER_DETAIL_QUERY_KEY(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default useUser;
