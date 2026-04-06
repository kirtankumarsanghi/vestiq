'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('vestiq_theme') : null;
    const preferred =
      stored ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark');

    setTheme(preferred);
    document.documentElement.setAttribute('data-theme', preferred);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('vestiq_theme', next);
      return next;
    });
  }

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
