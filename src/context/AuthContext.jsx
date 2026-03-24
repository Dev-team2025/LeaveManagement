import { createContext, useEffect, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'lms_auth'

export const AuthContext = createContext(undefined)

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { user: null, token: null, role: null }
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || 'null')

    return {
      user: parsed?.user || null,
      token: parsed?.token || null,
      role: parsed?.role || null,
    }
  } catch {
    return { user: null, token: null, role: null }
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(readStoredAuth)

  useEffect(() => {
    if (authState.token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
      return
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [authState])

  const login = ({ user, token, role }) => {
    setAuthState({
      user,
      token,
      role: role || user?.role || null,
    })
  }

  const logout = () => {
    setAuthState({ user: null, token: null, role: null })
  }

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      role: authState.role,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
