
import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    // Check for system preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const defaultTheme = isDarkMode ? 'dark' : 'light'
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(defaultTheme)
    }
  }, [])

  const setThemeValue = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply theme to document
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { theme, setTheme: setThemeValue }
}
