import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="auth-section">
      <article className="auth-card glass-card">
        <h2>Page introuvable</h2>
        <p className="muted">La route demandee n existe pas.</p>
        <Link to="/" className="primary-button">
          Retour a l accueil
        </Link>
      </article>
    </section>
  )
}

