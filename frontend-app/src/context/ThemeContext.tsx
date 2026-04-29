import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * ThemeContext controls the UI theme (dark / light).
 * <p>
 * It persists the theme in localStorage and also writes it to
 * {@code document.documentElement.dataset.theme} so CSS can style based on it.
 */
type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'ztc_theme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * Determines the initial theme.
 * <p>
 * Priority:
 * 1) user choice stored in localStorage
 * 2) OS preference (prefers-color-scheme)
 */
function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * ThemeProvider wraps the app and exposes theme state through {@link useTheme}.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    // Allow CSS to target [data-theme="dark"] and [data-theme="light"].
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((previous) => (previous === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme returns the current theme and helper functions.
 * <p>
 * Must be used inside {@link ThemeProvider}.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}

