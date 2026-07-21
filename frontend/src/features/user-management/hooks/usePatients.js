/**
 * PulseCare AI - Custom hook to fetch patients list
 */

import { useQuery } from '@tanstack/react-query';
import userApi from '../api/user.api';

export const PATIENTS_QUERY_KEY = (params) => ['users', 'patients', params];

export const usePatients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: PATIENTS_QUERY_KEY(params),
    queryFn: () => userApi.getPatients(params),
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default usePatients;
