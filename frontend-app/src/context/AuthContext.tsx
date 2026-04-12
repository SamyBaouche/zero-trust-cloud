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

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken())
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const initialToken = getToken()
    return initialToken ? decodeEmailFromToken(initialToken) : null
  })

  const logout = useCallback(() => {
    removeToken()
    setTokenState(null)
    setUserEmail(null)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [logout])

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest(payload)
    setToken(response.token)
    setTokenState(response.token)
    setUserEmail(decodeEmailFromToken(response.token))
  }, [])

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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

