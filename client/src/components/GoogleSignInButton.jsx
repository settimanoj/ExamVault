import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function GoogleSignInButton({ onSuccess, className = '' }) {
  const { loginWithGoogle } = useAuth()
  const containerRef = useRef(null)
  const [buttonWidth, setButtonWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width)
        if (width > 0) setButtonWidth(Math.min(width, 400))
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSuccess = async (credentialResponse) => {
    try {
      const user = await loginWithGoogle(credentialResponse)
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`)
      onSuccess?.(user)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to sign in with Google right now.'

      toast.error(message)
    }
  }

  return (
    <div ref={containerRef} className={`w-full flex justify-center ${className}`}>
      {buttonWidth > 0 ? (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error('Google sign-in was cancelled or failed.')}
          theme="filled_black"
          shape="pill"
          size="large"
          text="signin_with"
          width={buttonWidth.toString()}
        />
      ) : (
        <div className="h-10 w-full animate-pulse rounded-full bg-slate-800/50" />
      )}
    </div>
  )
}
