import AuthGate from '../components/AuthGate'
import DashboardPage from './DashboardPage'

export default function AdminRoutePage() {
  return (
    <AuthGate
      requireAdmin
      title="Admin access required"
      description="Sign in with your approved VIT-AP Google account to access ExamVault administration."
    >
      <DashboardPage />
    </AuthGate>
  )
}
