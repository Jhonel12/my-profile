import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const newDark = !prev
      localStorage.setItem('theme', newDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', newDark)
      return newDark
    })
  }

  return { isDark, toggleTheme }
}
