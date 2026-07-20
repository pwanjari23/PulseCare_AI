import { useAuthStore } from '../stores/auth.store';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    initialized,
    loading,
    error,
    login,
    logout,
    updateProfile,
    clearAuth,
  } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    initialized,
    loading,
    error,
    login,
    logout,
    updateProfile,
    clearAuth,
  };
};

export default useAuth;
