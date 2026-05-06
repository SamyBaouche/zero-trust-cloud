import axios from 'axios'

/**
 * Extracts a human-readable message from common backend error payload shapes.
 */
function extractApiMessage(data: unknown): string | null {
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object') {
    const payload = data as { message?: string; detail?: string; error?: string }
    return payload.message || payload.detail || payload.error || null
  }

  return null
}

/**
 * Maps any login request error to a user-friendly message.
 *
 * @param error Axios error (or unknown) thrown by the login request
 * @returns message safe to display in UI
 */
export function getLoginErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unexpected error during login. Please try again.'
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Login request timed out. Please try again.'
    }
    return 'Cannot reach server (network/CORS). Please verify backend URL and CORS settings.'
  }

  const status = error.response?.status
  const apiMessage = extractApiMessage(error.response?.data)

  if (status === 400 && apiMessage) {
    if (apiMessage.toLowerCase().includes('email')) {
      return 'Email is required.'
    }
    if (apiMessage.toLowerCase().includes('password')) {
      return 'Password is required.'
    }
    return apiMessage
  }

  if (status === 401) {
    return 'Invalid email or password.'
  }

  if (status === 429) {
    return 'Too many attempts. Please wait before trying again.'
  }

  if (status === 500) {
    return apiMessage || 'Server error during login. Please try again later.'
  }

  return apiMessage || 'Unable to login right now. Please try again.'
}

/**
 * Maps any register request error to a user-friendly message.
 *
 * @param error Axios error (or unknown) thrown by the register request
 * @returns message safe to display in UI
 */
export function getRegisterErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Unexpected error during registration. Please try again.'
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Registration request timed out. Please try again.'
    }
    return 'Cannot reach server (network/CORS). Please verify backend URL and CORS settings.'
  }

  const status = error.response?.status
  const apiMessage = extractApiMessage(error.response?.data)
  const normalized = (apiMessage || '').toLowerCase()

  if (status === 409) {
    return 'This email is already in use.'
  }

  if (status === 400) {
    if (normalized.includes('valid email')) {
      return 'Please enter a valid email address.'
    }
    if (normalized.includes('at least 8')) {
      return 'Password must contain at least 8 characters.'
    }
    if (normalized.includes('first name') || normalized.includes('last name')) {
      return 'First name and last name are required.'
    }
    if (normalized.includes('date of birth') && normalized.includes('required')) {
      return 'Date of birth is required.'
    }
    if (normalized.includes('yyyy-mm-dd')) {
      return 'Date of birth must use format YYYY-MM-DD.'
    }
    if (normalized.includes('at least 13')) {
      return 'You must be at least 13 years old to register.'
    }
    if (normalized.includes('phone format')) {
      return 'Phone number format is invalid.'
    }
    return apiMessage || 'Registration data is invalid.'
  }

  if (status === 429) {
    return 'Too many attempts. Please wait before trying again.'
  }

  return apiMessage || 'Unable to register right now. Please try again.'
}


