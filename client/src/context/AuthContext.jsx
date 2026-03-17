import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  getCurrentUser,
  googleLogin,
  setAuthToken,
  clearAuthToken,
} from '../services/api'

const AUTH_STORAGE_KEY = 'examvault_auth_token'
const SUPPRESS_AUTH_TOAST_KEY = 'examvault_suppress_auth_toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setAuthToken(token)
    } else {
      clearAuthToken()
    }
  }, [token])

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await getCurrentUser()
        setUser(data.user)
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrapAuth()
  }, [token])

  const loginWithGoogle = async (credentialResponse) => {
    const idToken = credentialResponse?.credential

    if (!idToken) {
      throw new Error('Google login did not return a valid credential.')
    }

    const { data } = await googleLogin(idToken)

    localStorage.setItem(AUTH_STORAGE_KEY, data.token)
    setToken(data.token)
    setUser(data.user)

    return data.user
  }

  const logout = () => {
    sessionStorage.setItem(SUPPRESS_AUTH_TOAST_KEY, 'true')
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setToken(null)
    setUser(null)
    clearAuthToken()
    toast.success('Logged out successfully.')
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      loginWithGoogle,
      logout,
    }),
    [token, user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
