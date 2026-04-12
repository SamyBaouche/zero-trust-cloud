import apiClient from './apiClient'
import type { AccessCheckRequest, AccessCheckResponse } from '../types/access'

export async function submitAccessCheck(
  payload: AccessCheckRequest,
): Promise<AccessCheckResponse> {
  const { data } = await apiClient.post<AccessCheckResponse>('/access/check', payload)
  return data
}

