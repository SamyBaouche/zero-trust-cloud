/**
 * Security alert record returned by the backend.
 * <p>
 * Backend: GET /alerts
 */
export interface SecurityAlert {
  id: number
  userEmail: string
  type: string
  message: string
  resource: string
  action: string
  riskScore: number
  createdAt: string
}

