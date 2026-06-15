import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Default to dark mode if nothing is stored, or if preferred color scheme is dark. 
    // Usually we default to true to match previous design
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return true; // Match the original retro dark vibe
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}
