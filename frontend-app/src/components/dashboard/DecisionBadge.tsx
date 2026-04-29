import type { AccessDecision } from '../../types/access'

interface DecisionBadgeProps {
  decision: AccessDecision
}

/**
 * DecisionBadge displays an access decision (ALLOW / CHALLENGE / DENY) with a colored badge.
 * <p>
 * Styling is controlled by CSS classes: decision-allow / decision-challenge / decision-deny.
 */
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

