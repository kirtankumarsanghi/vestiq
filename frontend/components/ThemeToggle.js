'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
