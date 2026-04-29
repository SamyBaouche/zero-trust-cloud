import apiClient from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

/**
 * Calls the backend login endpoint.
 * <p>
 * Endpoint: {@code POST /auth/login}
 *
 * @param payload user credentials
 * @returns JWT token wrapper
 */
export async function loginRequest(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

/**
 * Calls the backend register endpoint.
 * <p>
 * Endpoint: {@code POST /auth/register}
 *
 * @param payload registration fields
 * @returns a plain success message string
 */
export async function registerRequest(payload: RegisterRequest): Promise<string> {
  const { data } = await apiClient.post<string>('/auth/register', payload)
  return data
}

