import type { AccessDecision } from '../../types/access'

interface DecisionBadgeProps {
  decision: AccessDecision
}

export default function DecisionBadge({ decision }: DecisionBadgeProps) {
  const normalized = decision.toUpperCase()
  const variant =
    normalized === 'ALLOW'
      ? 'decision-allow'
      : normalized === 'CHALLENGE'
        ? 'decision-challenge'
        : 'decision-deny'

  return <span className={`decision-badge ${variant}`}>{normalized}</span>
}

