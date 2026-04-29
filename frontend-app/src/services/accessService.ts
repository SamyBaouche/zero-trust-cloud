import apiClient from './apiClient'
import type { AccessCheckRequest, AccessCheckResponse, AttackScenario } from '../types/access'

/**
 * Submits an access request to the backend decision engine.
 * <p>
 * Endpoint: {@code POST /access/check}
 */
export async function submitAccessCheck(
  payload: AccessCheckRequest,
): Promise<AccessCheckResponse> {
  const { data } = await apiClient.post<AccessCheckResponse>('/access/check', payload)
  return data
}

/**
 * Fetches predefined attack scenarios used by the simulator UI.
 * <p>
 * Endpoint: {@code GET /access/scenarios}
 */
export async function fetchAttackScenarios(): Promise<AttackScenario[]> {
  const { data } = await apiClient.get<AttackScenario[]>('/access/scenarios')
  return data
}

/**
 * Runs a selected scenario through the backend engine.
 * <p>
 * Endpoint: {@code POST /access/simulate/:scenarioId}
 */
export async function runAttackSimulation(scenarioId: string): Promise<AccessCheckResponse> {
  const { data } = await apiClient.post<AccessCheckResponse>(`/access/simulate/${scenarioId}`)
  return data
}

