import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Shield, Activity, Archive } from 'lucide-react'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const redirectTo = location.state?.from?.pathname || '/home'

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10">
        <section className="flex-1 hidden lg:block">
          <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-10 shadow-[0_18px_45px_rgba(0,0,0,0.65)] overflow-hidden">
            <div className="pointer-events-none absolute -left-10 -top-24 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary-500/20 bg-primary-500/5 px-4 py-1 text-xs font-medium tracking-wide text-primary-200/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secure, institution-only access
              </div>

              <div className="mb-6 flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 shadow-lg shadow-primary-900/50">
                  <Archive className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-50 leading-snug">
                  Welcome to <br />
                  <span className="bg-gradient-to-r from-primary-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    ExamVault
                  </span>
                </h1>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                Your ultimate academic companion. Find verified previous year papers, insights, and GPA tools organized in one trustworthy space for VIT-AP students.
              </p>

              <dl className="grid max-w-md grid-cols-2 gap-4 text-xs text-slate-300/90">
                <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-4 hover:border-primary-500/50 transition-colors">
                  <dt className="flex items-center gap-2 font-medium text-slate-100">
                    <Shield className="w-5 h-5 text-primary-400" /> Verified access
                  </dt>
                  <dd className="text-slate-400">Restricted to institution-issued email IDs only.</dd>
                </div>
                <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-4 hover:border-emerald-500/50 transition-colors">
                  <dt className="flex items-center gap-2 font-medium text-slate-100">
                    <Activity className="w-5 h-5 text-emerald-400" /> Data protection
                  </dt>
                  <dd className="text-slate-400">Your information is encrypted and never sold.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="flex-1 max-w-md w-full">
          <div className="mb-8 flex flex-col lg:hidden gap-3 items-center text-center">
            <div className="flex items-center gap-4 justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 shadow-md shadow-primary-900/50">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 text-left leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-primary-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent font-bold">
                  ExamVault
                </span>
              </h1>
            </div>
            <p className="text-sm text-slate-400">The official hub for VIT-AP exam resources.</p>
          </div>

          <div className="card relative overflow-hidden border border-slate-700/80 hover:border-primary-500/60 bg-slate-950/80 px-6 py-8 sm:p-10 shadow-[0_18px_45px_rgba(0,0,0,0.65)] hover:shadow-[0_0_32px_rgba(56,189,248,0.35)] transition-colors transition-shadow duration-300">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl" />
              <div className="absolute -bottom-24 left-4 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/10">
                  <Lock className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300/80">
                    Access Gateway
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
                    Login or create account
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-400">
                Use your <span className="font-medium text-primary-200">college Google email ID</span> to
                sign in. Personal email IDs are not accepted.
              </p>

              <div className="space-y-4">
                <GoogleSignInButton
                  className="w-full"
                  onSuccess={() => navigate(redirectTo, { replace: true })}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Or continue as guest
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <button
                type="button"
                onClick={() => navigate('/home')}
                className="w-full py-3 text-sm font-medium rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
              >
                Continue without login
              </button>

              <p className="pt-2 text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                By continuing, you confirm that you are an authorized student of VIT-AP university and agree to the platform&apos;s{' '}
                <span className="cursor-pointer text-primary-400 hover:text-primary-300">Terms</span> and{' '}
                <span className="cursor-pointer text-primary-400 hover:text-primary-300">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
