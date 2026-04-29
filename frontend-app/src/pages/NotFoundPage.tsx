import { Link } from 'react-router-dom'

/**
 * NotFoundPage is rendered when no route matches (404).
 */
export default function NotFoundPage() {
  return (
    <section className="auth-section">
      <article className="auth-card glass-card">
        <h2>Page not found</h2>
        <p className="muted">The requested route does not exist.</p>
        <Link to="/" className="primary-button">
          Back to home
        </Link>
      </article>
    </section>
  )
}

