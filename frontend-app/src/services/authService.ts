import apiClient from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export async function loginRequest(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterRequest): Promise<string> {
  const { data } = await apiClient.post<string>('/auth/register', payload)
  return data
}

