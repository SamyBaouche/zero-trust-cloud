import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import PrivateLayout from '../components/layout/PrivateLayout'
import PublicLayout from '../components/layout/PublicLayout'
import DashboardPage from '../pages/DashboardPage'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import LogsPage from '../pages/LogsPage'
import NotFoundPage from '../pages/NotFoundPage'
import RegisterPage from '../pages/RegisterPage'
import AttackSimulatorPage from '../pages/AttackSimulatorPage'
import SettingsPage from '../pages/SettingsPage'

/**
 * AppRouter defines all client-side routes.
 * <p>
 * Routing strategy:
 * - Public routes (landing, login, register) are wrapped by {@link PublicLayout}
 * - Private routes are guarded by {@link ProtectedRoute} and then wrapped by {@link PrivateLayout}
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Public pages: accessible without a JWT token */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected pages: require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/simulator" element={<AttackSimulatorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />

      {/* Small compatibility redirect (some links may still point to /home). */}
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

