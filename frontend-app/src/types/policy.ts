/**
 * Access policy returned by the backend.
 * <p>
 * Policies are rules that can override access decisions based on risk score.
 * Backend: GET /policies
 */
export interface Policy {
  id: number
  resource: string
  action: string
  decision: string
  minRiskScore?: number | null
  condition?: string | null
  enabled: boolean
}

