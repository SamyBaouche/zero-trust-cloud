import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe sont requis.')
      return
    }

    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      const message = await register({ email, password })
      setSuccessMessage(message || 'Compte cree avec succes. Vous pouvez maintenant vous connecter.')
      setEmail('')
      setPassword('')
    } catch {
      setError('Inscription impossible. Essayez avec un autre email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card glass-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="muted">Lancez votre environnement Zero Trust en quelques secondes.</p>

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cloud@company.com"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 caracteres"
        />

        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Creation...' : 'Register'}
        </button>

        <p className="muted">
          Deja inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </section>
  )
}

