import React, { useEffect } from 'react';
import { useThemeStore } from '../stores/theme.store';

export const ThemeProvider = ({ children }) => {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    const cleanup = initTheme();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
