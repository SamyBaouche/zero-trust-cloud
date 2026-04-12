import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="ghost-button" onClick={toggleTheme} type="button">
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </button>
  )
}

