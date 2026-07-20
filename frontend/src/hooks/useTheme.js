import { useThemeStore } from '../stores/theme.store';

export const useTheme = () => {
  const { theme, setTheme, initTheme } = useThemeStore();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  };
};

export default useTheme;
