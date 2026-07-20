import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive query refetching in production
      retry: 1,                    // Limit retries on clinical telemetry failures
      staleTime: 5 * 60 * 1000,    // Keep vitals cache warm for 5 minutes
    },
  },
});

export default queryClient;
