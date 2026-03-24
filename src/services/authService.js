import api from '@/services/api'
import { API_ENDPOINTS, ROLES } from '@/utils/constants'

function buildMockUser(credentials = {}) {
  const email = credentials.email?.toLowerCase() || ''
  const role =
    Object.values(ROLES).find((value) => email.includes(value)) || ROLES.EMPLOYEE

  return {
    id: `${role}-demo`,
    name: credentials.email?.split('@')[0]?.replace('.', ' ') || 'Demo User',
    email: credentials.email || `${role}@demo.local`,
    role,
  }
}

export const authService = {
  async login(credentials) {
    try {
      const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)

      return data
    } catch (error) {
      if (import.meta.env.DEV) {
        const user = buildMockUser(credentials)

        return {
          token: `demo-token-${user.role}`,
          user,
          role: user.role,
        }
      }

      throw error
    }
  },

  async logout() {
    try {
      const { data } = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      return data
    } catch (error) {
      return { success: true, error }
    }
  },

  async getProfile() {
    const { data } = await api.get(API_ENDPOINTS.AUTH.PROFILE)
    return data
  },
}

export default authService
