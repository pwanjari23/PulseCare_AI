/**
 * PulseCare AI - Custom hook to fetch doctors list
 */

import { useQuery } from '@tanstack/react-query';
import userApi from '../api/user.api';

export const DOCTORS_QUERY_KEY = (params) => ['users', 'doctors', params];

export const useDoctors = (params = {}, options = {}) => {
  return useQuery({
    queryKey: DOCTORS_QUERY_KEY(params),
    queryFn: () => userApi.getDoctors(params),
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default useDoctors;
