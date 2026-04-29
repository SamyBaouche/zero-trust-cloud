const TOKEN_KEY = 'ztc_token'

/**
 * Reads the JWT token from localStorage.
 *
 * @returns token string or null if user is not logged in
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Saves the JWT token in localStorage.
 * <p>
 * This allows refresh / tab reopen to keep the authenticated state.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Clears the stored JWT token from localStorage. */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}


