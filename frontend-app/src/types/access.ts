export type AccessDecision = 'ALLOW' | 'CHALLENGE' | 'DENY' | string

export interface AccessCheckRequest {
  resource: string
  action: string
  ipAddress: string
  location: string
  device: string
}

export interface AccessCheckResponse {
  decision: AccessDecision
  riskScore: number
  message: string
}

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
}

