/**
 * Decision returned by the access engine.
 * <p>
 * Expected values are ALLOW / CHALLENGE / DENY, but we keep it open for future values.
 */
export type AccessDecision = 'ALLOW' | 'CHALLENGE' | 'DENY' | string

/**
 * Payload sent to the access decision endpoint.
 * <p>
 * Backend: POST /access/check
 */
export interface AccessCheckRequest {
  resource: string
  action: string
  ipAddress: string
  location: string
  device: string
}

/**
 * Response returned by the access decision endpoint.
 */
export interface AccessCheckResponse {
  decision: AccessDecision
  riskScore: number
  message: string
  reasons?: string[]
}

/**
 * One predefined scenario used by the attack simulator.
 * <p>
 * Backend: GET /access/scenarios
 */
export interface AttackScenario {
  id: string
  title: string
  description: string
  resource: string
  action: string
  ipAddress: string
  location: string
  device: string
}

/**
 * Audit log record returned by the backend.
 * <p>
 * Backend: GET /logs
 */
export interface AccessLog {
  id?: number
  userEmail: string
  resource: string
  action: string
  decision: AccessDecision
  createdAt: string
  ipAddress: string
  location: string
  device: string
  riskScore?: number
  message?: string
  reasons?: string[]
}
