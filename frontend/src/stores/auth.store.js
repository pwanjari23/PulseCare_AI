import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storage';
import authApi from '../services/api/auth.api';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  refreshingToken: false,
  error: null,

  login: (accessToken, refreshToken, user) => {
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    set({
      user,
      accessToken,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: async (queryClient) => {
    set({ loading: true });
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout error on server:', e);
    } finally {
      if (queryClient && typeof queryClient.clear === 'function') {
        queryClient.clear();
      }
      get().clearAuth();
    }
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      refreshingToken: false,
      error: null,
    });
  },

  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: !!token });
  },

  updateProfile: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
    }));
  },

  fetchProfile: async () => {
    try {
      const profileData = await authApi.getProfile();
      const user = profileData?.user || profileData;
      set({ user });
      return user;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) throw new Error('No refresh token available');

    set({ refreshingToken: true });
    try {
      const refreshResult = await authApi.refreshToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: initialUser } = refreshResult;

      set({ accessToken: newAccessToken, isAuthenticated: true });
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      let user = initialUser;
      if (!user) {
        const profileRes = await authApi.getProfile();
        user = profileRes?.user || profileRes;
      }
      set({ user, refreshingToken: false });
      return user;
    } catch (error) {
      set({ refreshingToken: false });
      get().clearAuth();
      throw error;
    }
  },

  restoreSession: async () => {
    if (get().initialized) return;

    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      set({ initialized: true });
      return;
    }

    set({ loading: true, error: null });
    try {
      const refreshResult = await authApi.refreshToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: initialUser } = refreshResult;

      set({ accessToken: newAccessToken });
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      let user = initialUser;
      if (!user) {
        const profileRes = await authApi.getProfile();
        user = profileRes?.user || profileRes;
      }

      set({
        user,
        isAuthenticated: true,
        initialized: true,
        loading: false,
      });
    } catch (err) {
      console.error('Session restoration failed:', err);
      get().clearAuth();
      set({ initialized: true, loading: false });
    }
  },
}));

export default useAuthStore;
