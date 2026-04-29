import { Link } from 'react-router-dom'

/**
 * LandingPage is the public "home" page.
 * <p>
 * It explains what the project does and provides links to register/login.
 * The content is intentionally static (no backend calls) to keep it fast and simple.
 */
export default function LandingPage() {
  const features = [
    {
      title: 'Risk-Based Access Decisions',
      description:
        'Evaluate each access request using a dynamic risk scoring system based on context such as IP, location, action, and resource.',
      icon: 'RS',
    },
    {
      title: 'Access Control Engine',
      description:
        'Automatically decide whether to ALLOW, CHALLENGE, or DENY access based on calculated risk.',
      icon: 'AC',
    },
    {
      title: 'Audit Logs & Monitoring',
      description:
        'Store and display all access attempts with full details for security auditing and monitoring.',
      icon: 'LG',
    },
    {
      title: 'Secure Authentication',
      description:
        'Authenticate users using JWT and protect access to sensitive operations.',
      icon: 'JWT',
    },
  ]

  const steps = [
    {
      title: 'User Authentication',
      description: 'Users securely log in using JWT authentication.',
    },
    {
      title: 'Risk Evaluation',
      description: 'Each request is evaluated using context (IP, location, action, resource).',
    },
    {
      title: 'Access Decision',
      description: 'The system returns ALLOW, CHALLENGE, or DENY based on calculated risk.',
    },
  ]

  return (
    <div className="landing-page">
      <section className="landing-hero card-dark">
        <p className="landing-kicker">Zero Trust Security Platform</p>
        <h1 className="landing-title">Zero Trust Cloud</h1>
        <p className="landing-subtitle">Secure access. Smart decisions. Full visibility.</p>
        <p className="landing-description">
          A modern cloud security platform implementing Zero Trust principles with real-time
          risk-based access evaluation.
        </p>
        <div className="landing-actions">
          <Link to="/register" className="primary-button">
            Get Started
          </Link>
          <Link to="/login" className="ghost-button">
            Login
          </Link>
        </div>
      </section>

      <section className="landing-features">
        <h2>Core Features</h2>
        <div className="landing-grid">
          {features.map((feature) => (
            <article className="landing-feature-card card-dark" key={feature.title}>
              <span className="landing-feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-how">
        <h2>How It Works</h2>
        <div className="landing-steps">
          {steps.map((step, index) => (
            <article className="landing-step card-dark" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta card-dark">
        <h2>Start securing your cloud environment today.</h2>
        <Link to="/register" className="primary-button">
          Create Account
        </Link>
      </section>
    </div>
  )
}


