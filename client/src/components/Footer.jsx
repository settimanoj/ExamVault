import { Link } from 'react-router-dom'
import { Archive } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gray-800/60 bg-gray-950 pt-16 pb-8 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-900/10 rounded-full blur-[128px] pointer-events-none" />
      
      {/* Gradient top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/home" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:shadow-primary-700/50 transition-all duration-300 group-hover:scale-105">
                <Archive className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                ExamVault
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your ultimate academic companion. ExamVault keeps verified previous year papers, insights, and GPA tools organized in one trustworthy space for VIT-AP students.
            </p>
            
            {/* CTA Button */}
            <Link
              to="/slot-papers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white hover:border-primary-500/50 hover:bg-gray-800/50 transition-all duration-300 group shadow-sm"
            >
              Browse Papers
              <span className="text-primary-400 group-hover:translate-x-0.5 transition-transform duration-300">
                →
              </span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider">Platform</h3>
            <ul className="space-y-3">
              {[
                { to: '/home', label: 'Home' },
                { to: '/upload', label: 'Upload Paper' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/calculator', label: 'CGPA Calculator' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {[
                { to: '/slot-papers', label: 'Recent Papers' },
                { to: '/pyqs', label: 'Previous Years' },
                { to: '/admin', label: 'Admin Panel' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Legal */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/manoj-setti-6367ba2ba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-accent-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <svg
                    className="h-4 w-4 text-gray-500 group-hover:text-accent-400 transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8.25h4.5V24h-4.5V8.25zM8.75 8.25h4.32v2.14h.06c.6-1.14 2.08-2.35 4.28-2.35 4.58 0 5.42 3.01 5.42 6.92V24h-4.5v-7.52c0-1.79-.03-4.09-2.5-4.09-2.5 0-2.88 1.95-2.88 3.96V24h-4.5V8.25z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} ExamVault. Built for VIT-AP students.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Crafted with <span className="text-accent-500">♥</span> by Manoj Setti
          </p>
        </div>
      </div>
    </footer>
  )
}


