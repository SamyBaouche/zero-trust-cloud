import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'

export default function PrivateLayout() {
  const { userEmail, logout } = useAuth()
  const navigate = useNavigate()

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
        <p className="muted">{userEmail ?? 'Utilisateur authentifie'}</p>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/logs">Audit logs</NavLink>
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
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

