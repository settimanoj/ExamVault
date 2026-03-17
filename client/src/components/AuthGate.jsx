import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const SUPPRESS_AUTH_TOAST_KEY = 'examvault_suppress_auth_toast'

function LoadingState() {
  return (
    <div className="page-container">
      <div className="max-w-xl mx-auto card p-8 text-center animate-pulse">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-800 mb-4" />
        <div className="h-5 bg-gray-800 rounded w-1/2 mx-auto mb-3" />
        <div className="h-4 bg-gray-800 rounded w-2/3 mx-auto" />
      </div>
    </div>
  )
}

export default function AuthGate({ children, requireAdmin = false }) {
  const { loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const hasShownMessageRef = useRef(false)
  const hasRedirectedRef = useRef(false)

  if (loading) {
    return <LoadingState />
  }

  useEffect(() => {
    if (loading || hasRedirectedRef.current) return

    if (!isAuthenticated) {
      const shouldSuppressToast = sessionStorage.getItem(SUPPRESS_AUTH_TOAST_KEY) === 'true'

      if (shouldSuppressToast) {
        sessionStorage.removeItem(SUPPRESS_AUTH_TOAST_KEY)
      } else {
        toast.error('Please sign in to access this feature.')
      }

      hasShownMessageRef.current = true
      hasRedirectedRef.current = true
      navigate('/', { replace: true, state: { from: location } })
    } else if (requireAdmin && !isAdmin) {
      toast.error('Admin privileges required to view this page.')
      hasShownMessageRef.current = true
      hasRedirectedRef.current = true
      navigate('/dashboard', { replace: true, state: { from: location } })
    }
  }, [loading, isAuthenticated, requireAdmin, isAdmin, location, navigate])

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return <LoadingState />
  }

  return children
}
