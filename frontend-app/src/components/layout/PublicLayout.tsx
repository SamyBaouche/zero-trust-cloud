import { Link, Outlet } from 'react-router-dom'

/**
 * PublicLayout is the wrapper for public pages (landing/login/register).
 * <p>
 * It renders a lightweight header and an <Outlet /> where the current route is displayed.
 */
export default function PublicLayout() {
  return (
    <div className="public-shell">
      <header className="public-navbar">
        <Link to="/" className="brand">
          Zero Trust Cloud
        </Link>
        <nav>
          {/* Simple navigation for public routes. */}
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

