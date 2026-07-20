import { create } from 'zustand';
import themeConfig from '../config/theme.config';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem(themeConfig.storageKey) || themeConfig.defaultTheme, // 'light' | 'dark' | 'system'
  
  setTheme: (newTheme) => set(() => {
    localStorage.setItem(themeConfig.storageKey, newTheme);
    applyTheme(newTheme);
    return { theme: newTheme };
  }),

  initTheme: () => {
    const stored = localStorage.getItem(themeConfig.storageKey) || themeConfig.defaultTheme;
    applyTheme(stored);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      const current = localStorage.getItem(themeConfig.storageKey) || themeConfig.defaultTheme;
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }
}));

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.add('light');
  } else {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isSystemDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }
};

export default useThemeStore;
