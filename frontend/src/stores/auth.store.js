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

  logout: async () => {
    set({ loading: true });
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout error on server:', e);
    } finally {
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

  restoreSession: async () => {
    if (get().initialized) return;

    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      set({ initialized: true });
      return;
    }

    set({ loading: true, error: null });
    try {
      // First, get a new access token
      const refreshResult = await authApi.refreshToken(refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: initialUser } = refreshResult;

      set({ accessToken: newAccessToken });
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      }

      // If user was returned in refresh, use it. Otherwise, fetch profile.
      let user = initialUser;
      if (!user) {
        user = await authApi.getProfile();
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
