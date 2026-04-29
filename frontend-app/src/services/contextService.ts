import axios from 'axios'
import apiClient from './apiClient'
import type { DeleteAccountRequest, UpdateUserProfileRequest, UserProfile } from '../types/auth'

/**
 * Response returned by {@code GET /context/me}.
 * <p>
 * This is the "runtime context" of the current request, used by the access engine
 * (IP address, device user-agent, etc.).
 */
export type CurrentContextResponse = {
  ipAddress: string
  device: string
}

/**
 * Fetches the current request context (IP + device) from the backend.
 * <p>
 * Endpoint: GET /context/me
 */
export async function getCurrentContext(): Promise<CurrentContextResponse> {
  const { data } = await apiClient.get<CurrentContextResponse>('/context/me')
  return data
}

/**
 * Fetches the authenticated user's profile.
 * <p>
 * Endpoint: GET /context/profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/context/profile')
  return data
}

/**
 * Updates editable profile fields for the current user.
 * <p>
 * Endpoint: PUT /context/profile
 *
 * Note:
 * Some proxies/environments may block PUT requests. If the backend responds with 405,
 * we automatically retry using POST.
 */
export async function updateCurrentUserProfile(payload: UpdateUserProfileRequest): Promise<UserProfile> {
  try {
    const { data } = await apiClient.put<UserProfile>('/context/profile', payload)
    return data
  } catch (error) {
    // Fallback for instances that reject PUT with 405.
    if (axios.isAxiosError(error) && error.response?.status === 405) {
      const { data } = await apiClient.post<UserProfile>('/context/profile', payload)
      return data
    }
    throw error
  }
}

/**
 * Deletes the current account.
 * <p>
 * Endpoint: DELETE /context/account
 */
export async function deleteCurrentAccount(payload: DeleteAccountRequest): Promise<string> {
  const { data } = await apiClient.delete<string>('/context/account', { data: payload })
  return data
}

