import { Link } from 'react-router-dom'

const features = [
  {
    title: 'JWT Authentication',
    description:
      'Session stateless securisee avec jetons, policies Zero Trust et validation continue.',
  },
  {
    title: 'Access Control',
    description:
      'Evaluation contextuelle des requetes avec ressource, action, emplacement et appareil.',
  },
  {
    title: 'Risk-based Decisions',
    description:
      'Decision engine ALLOW / CHALLENGE / DENY base sur un score de risque interpretable.',
  },
  {
    title: 'Audit Logs',
    description:
      'Trails complets pour investigations SOC, traces d activite et conformite.',
  },
  {
    title: 'Cloud Security Dashboard',
    description:
      'Vue operationnelle centralisee pour equipes cloud, full stack et devops.',
  },
]

const highlights = [
  { label: 'Decisions analysed', value: '2.4M+' },
  { label: 'Average response time', value: '< 120ms' },
  { label: 'Cloud environments', value: 'Multi-region' },
]

export default function LandingPage() {
  return (
    <>
      <section className="hero-section glass-card">
        <p className="eyebrow">Zero Trust Platform</p>
        <h1>Protect every request across your cloud perimeter</h1>
        <p>
          Zero Trust Cloud securise les acces applicatifs en temps reel: authentification,
          verification contextuelle, scoring de risque et audit complet.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="ghost-button">
            Login
          </Link>
          <Link to="/register" className="primary-button">
            Start for free
          </Link>
        </div>
      </section>

      <section className="features-grid">
        {features.map((feature) => (
          <article className="feature-card glass-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="highlights-grid">
        {highlights.map((item) => (
          <article className="highlight-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <footer className="footer">
        <p>Zero Trust Cloud - Modern cloud security dashboard.</p>
      </footer>
    </>
  )
}


