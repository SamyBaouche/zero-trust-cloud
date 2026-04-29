import apiClient from './apiClient'
import type { Policy } from '../types/policy'

/**
 * Fetches enabled access policies.
 * <p>
 * Endpoint: GET /policies
 */
export async function fetchPolicies(): Promise<Policy[]> {
  const { data } = await apiClient.get<Policy[]>('/policies')
  return data
}

