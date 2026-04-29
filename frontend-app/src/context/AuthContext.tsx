import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginRequest, registerRequest } from '../services/authService'
import { getToken, removeToken, setToken } from '../services/storage'
import type { AuthContextValue, LoginRequest, RegisterRequest } from '../types/auth'

/**
 * AuthContext stores the authentication state for the frontend.
 * <p>
 * What we store:
 * - JWT token (persisted in localStorage via storage.ts)
 * - userEmail (decoded from the token for convenience)
 * <p>
 * How logout can happen:
 * - user clicks "Logout"
 * - API returns 401, apiClient dispatches a global "auth:unauthorized" event
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Extracts an email from a JWT token without verifying the signature.
 * <p>
 * This is used only for display (UI) purposes.
 * The backend is still the source of truth for authentication.
 */
function decodeEmailFromToken(token: string): string | null {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) {
      return null
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = atob(normalized)
    const payload = JSON.parse(jsonPayload) as { sub?: string; email?: string }

    return payload.email ?? payload.sub ?? null
  } catch {
    return null
  }
}

/**
 * AuthProvider wraps the app and exposes auth helpers through {@link useAuth}.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken())
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const initialToken = getToken()
    return initialToken ? decodeEmailFromToken(initialToken) : null
  })

  /** Clears the token from storage and resets local auth state. */
  const logout = useCallback(() => {
    removeToken()
    setTokenState(null)
    setUserEmail(null)
  }, [])

  useEffect(() => {
    // Listen to a global event fired by apiClient when we receive an HTTP 401.
    const handleUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [logout])

  /** Performs login, stores the token, and updates in-memory state. */
  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest(payload)
    setToken(response.token)
    setTokenState(response.token)
    setUserEmail(decodeEmailFromToken(response.token))
  }, [])

  /** Registers a new account. The backend returns a plain message string. */
  const register = useCallback(async (payload: RegisterRequest) => {
    return registerRequest(payload)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userEmail,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [login, logout, register, token, userEmail],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth returns the current authentication state and helper functions.
 * <p>
 * This hook must be used inside {@link AuthProvider}.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

