/**
 * Payload sent to the login endpoint.
 * <p>
 * Backend: POST /auth/login
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Payload sent to the registration endpoint.
 * <p>
 * Backend: POST /auth/register
 */
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: string
  company?: string
  jobTitle?: string
  country?: string
  phone?: string
  department?: string
  securityClearance?: string
}

/**
 * Payload used to update profile settings.
 * <p>
 * All fields are optional: only provided fields will be updated by the backend.
 * Backend: PUT (or POST fallback) /context/profile
 */
export interface UpdateUserProfileRequest {
  email?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  company?: string
  jobTitle?: string
  country?: string
  phone?: string
  department?: string
  securityClearance?: string
}

/**
 * Payload sent when deleting an account.
 * <p>
 * The password is used as a confirmation step.
 * Backend: DELETE /context/account
 */
export interface DeleteAccountRequest {
  password: string
}


/**
 * User profile returned by the backend.
 * <p>
 * Backend: GET /context/profile
 */
export interface UserProfile {
  email: string
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  company?: string | null
  jobTitle?: string | null
  country?: string | null
  phone?: string | null
  department?: string | null
  securityClearance?: string | null
}

/**
 * Response returned by the login endpoint.
 * <p>
 * Backend: POST /auth/login
 */
export interface AuthResponse {
  token: string
}

/**
 * Shape of the AuthContext exposed by {@link useAuth}.
 */
export interface AuthContextValue {
  token: string | null
  userEmail: string | null
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<string>
  logout: () => void
}
