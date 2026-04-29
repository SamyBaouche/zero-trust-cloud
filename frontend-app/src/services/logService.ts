import apiClient from './apiClient'
import type { AccessLog } from '../types/access'

/**
 * Fetches access decision logs.
 * <p>
 * Primary endpoint: GET /logs
 * Fallback endpoint: GET /access/logs (kept for compatibility while backend routes evolve)
 */
export async function fetchLogs(): Promise<AccessLog[]> {
  try {
    const { data } = await apiClient.get<AccessLog[]>('/logs')
    return data
  } catch {
    // Optional fallback while backend endpoint naming is evolving.
    const { data } = await apiClient.get<AccessLog[]>('/access/logs')
    return data
  }
}

