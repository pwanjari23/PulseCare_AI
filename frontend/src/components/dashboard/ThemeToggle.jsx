import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/theme.store';

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
    </button>
  );
};

export default ThemeToggle;
