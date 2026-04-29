import axios from 'axios'
import { getToken, removeToken } from './storage'

/**
 * Base URL of the backend API.
 * <p>
 * If you change the backend port or deploy to another environment, update this value.
 */
const API_BASE_URL = 'http://localhost:8081'

/**
 * Shared Axios instance used by all frontend services.
 * <p>
 * It automatically attaches the JWT token on non-auth endpoints and reacts to 401 errors.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
})

/**
 * Request interceptor.
 * <p>
 * If a token exists, we attach it as `Authorization: Bearer <token>`.
 * We skip `/auth/*` endpoints because they are public.
 */
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  const requestUrl = config.url ?? ''
  const isAuthEndpoint = requestUrl.startsWith('/auth/')

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * Response interceptor.
 * <p>
 * If the backend returns 401 (Unauthorized), we clear the token and notify the app.
 * AuthContext listens to this event and logs the user out.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default apiClient

