import apiClient from './apiClient'
import type { SecurityAlert } from '../types/alert'

/**
 * Fetches recent security alerts for the current authenticated user.
 * <p>
 * Endpoint: {@code GET /alerts}
 */
export async function fetchAlerts(): Promise<SecurityAlert[]> {
  const { data } = await apiClient.get<SecurityAlert[]>('/alerts')
  return data
}

