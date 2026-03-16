import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function GoogleSignInButton({ onSuccess, className = '' }) {
  const { loginWithGoogle } = useAuth()

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
    <div className={`w-full ${className}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled or failed.')}
        theme="filled_black"
        shape="pill"
        size="large"
        text="signin_with"
        width="100%"
      />
    </div>
  )
}
