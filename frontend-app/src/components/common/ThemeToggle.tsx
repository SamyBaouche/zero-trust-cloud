import { useTheme } from '../../context/ThemeContext'

/**
 * ThemeToggle switches between dark and light mode.
 * <p>
 * Note: the button labels are currently hard-coded in French.
 * If needed, they can be connected to LanguageContext like other UI strings.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <span className="theme-icon-sun" aria-hidden="true" />
      <span className="theme-toggle-label">{isDark ? 'Clair' : 'Sombre'}</span>
      <span className="theme-icon-moon" aria-hidden="true" />
    </button>
  )
}

