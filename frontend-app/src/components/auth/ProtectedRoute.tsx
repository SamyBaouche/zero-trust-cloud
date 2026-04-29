import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute is a small route guard.
 * <p>
 * If the user is not authenticated, we redirect to /login.
 * We also store the current path in router state so the login page can redirect back.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // `state.from` is read by LoginPage to navigate back after a successful login.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

