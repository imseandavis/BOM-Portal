'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline, useMediaQuery } from '@mui/material'
import { lightTheme, darkTheme } from '@/theme/mui-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <MuiThemeProvider theme={mounted ? (prefersDarkMode ? darkTheme : lightTheme) : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
  )
} 