/**
 * PulseCare AI - Custom hook to fetch users list
 */

import { useQuery } from '@tanstack/react-query';
import userApi from '../api/user.api';

export const USERS_QUERY_KEY = (params) => ['users', 'list', params];

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: USERS_QUERY_KEY(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default useUsers;
