import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * PrivateLayout is the main shell for authenticated pages.
 * <p>
 * It provides a persistent sidebar and renders the current page using <Outlet />.
 */
export default function PrivateLayout() {
  const { userEmail, logout } = useAuth()
  const navigate = useNavigate()

  /** Logs out and sends the user back to the login page. */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          Zero Trust Cloud
        </Link>
        <p className="muted">{userEmail ?? 'Authenticated user'}</p>

        <nav className="sidebar-nav">
          {/* NavLink adds an "active" class automatically when the route matches. */}
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/logs">Audit logs</NavLink>
          <NavLink to="/simulator">Attack simulator</NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" className="ghost-button sidebar-settings-button">
            <span aria-hidden="true">⚙</span>
            <span>Settings</span>
          </NavLink>
          <button type="button" className="danger-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

