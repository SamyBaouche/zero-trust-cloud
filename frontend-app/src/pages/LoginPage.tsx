import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

/**
 * LoginPage lets a user authenticate and stores the JWT via AuthContext.
 * <p>
 * If the user was redirected here by {@link ProtectedRoute}, we read `location.state.from`
 * to navigate back to the originally requested page.
 */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // RegisterPage can pass a success message to display after creating an account.
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage ?? null

  // Default redirect is the dashboard.
  const fromPath = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await login({ email, password })
      navigate(fromPath, { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Try to extract a backend-provided error message.
        const apiMessage =
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string } | undefined)?.message
        setError(apiMessage || 'Invalid login. Please check your credentials.')
      } else {
        setError('Invalid login. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card glass-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to your Zero Trust workspace.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="security@company.com"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
        />

        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="muted">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </form>
    </section>
  )
}

