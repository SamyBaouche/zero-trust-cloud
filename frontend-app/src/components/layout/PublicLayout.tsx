import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '../common/ThemeToggle'

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <header className="public-navbar">
        <Link to="/" className="brand">
          Zero Trust Cloud
        </Link>
        <nav>
          <ThemeToggle />
          <Link to="/login" className="ghost-button">
            Login
          </Link>
          <Link to="/register" className="primary-button">
            Register
          </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

