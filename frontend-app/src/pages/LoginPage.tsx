import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fromPath = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe sont requis.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await login({ email, password })
      navigate(fromPath, { replace: true })
    } catch {
      setError('Connexion invalide. Verifiez vos identifiants.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card glass-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Connectez-vous a votre cockpit Zero Trust.</p>

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

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Connexion...' : 'Login'}
        </button>

        <p className="muted">
          Pas de compte ? <Link to="/register">Creer un compte</Link>
        </p>
      </form>
    </section>
  )
}

