
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check if document is available (client-side)
    if (typeof document !== 'undefined') {
      // Check if dark mode is enabled
      const isDarkMode = document.documentElement.classList.contains('dark');
      setTheme(isDarkMode ? 'dark' : 'light');
      
      // Create an observer to detect theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'class' &&
            mutation.target === document.documentElement
          ) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setTheme(isDarkMode ? 'dark' : 'light');
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return { theme, isDark: theme === 'dark' };
}
