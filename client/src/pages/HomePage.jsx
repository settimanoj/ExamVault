import { Link } from 'react-router-dom'
import { Upload, Clock, BookOpen, Calculator, ShieldCheck, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload Papers',
    description: 'Share exam papers with your peers — slot papers, PYQs, and more.',
    to: '/upload',
    cta: 'Upload Now',
    colorClass: 'from-primary-600/20 to-primary-900/10 border-primary-700/30',
    btnClass: 'btn-primary',
  },
  {
    icon: Clock,
    title: 'Recent Papers',
    description: 'Access the most recently uploaded papers organized by course, slot, and exam type.',
    to: '/slot-papers',
    cta: 'Browse Slot Papers',
    colorClass: 'from-blue-600/20 to-blue-900/10 border-blue-700/30',
    btnClass: 'btn-secondary',
  },
  {
    icon: BookOpen,
    title: 'Previous Year QPs',
    description: 'Prepare smarter with previous year question papers from all subjects.',
    to: '/pyqs',
    cta: 'Browse PYQs',
    colorClass: 'from-emerald-600/20 to-emerald-900/10 border-emerald-700/30',
    btnClass: 'btn-secondary',
  },
  {
    icon: Calculator,
    title: 'GPA & CGPA Calculator',
    description: 'Calculate your semester GPA and cumulative CGPA easily with grade mapping.',
    to: '/calculator',
    cta: 'Calculate Now',
    colorClass: 'from-orange-600/20 to-orange-900/10 border-orange-700/30',
    btnClass: 'btn-secondary',
  },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute top-32 right-10 w-[300px] h-[300px] bg-accent-600/10 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative pt-16 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-950/80 border border-primary-700/40 rounded-full text-primary-300 text-sm font-medium mb-6">
            <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            Your Academic Resource Hub
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Ace Your Exams with{' '}
            <span className="gradient-text">ExamVault</span>
          </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate platform for VIT-AP students — access recent and previous year question papers, and calculate your GPA/CGPA all in one place.
            </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/upload" className="btn-primary text-base px-7 py-3" id="hero-upload-btn">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Now
            </Link>
            <Link to="/slot-papers" className="btn-secondary text-base px-7 py-3" id="hero-browse-btn">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Papers
            </Link>
          </div>

          {/* Core Values / Trust Banner */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 pt-8 border-t border-gray-800/50 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, title: 'Verified Content', desc: 'Quality checked papers' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant search & download' },
              { icon: Users, title: 'Community Driven', desc: 'By VIT-APians, for VIT-APians' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 w-full md:w-1/3 hover:bg-gray-800/50 transition-colors text-left">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="page-container pt-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">All your exam prep tools, in one place.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, to, cta, colorClass, btnClass }) => (
            <div
              key={to}
              className={`group bg-gradient-to-br ${colorClass} border rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800/50 flex items-center justify-center shadow-inner">
                <Icon className="w-6 h-6 text-white group-hover:text-primary-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
              <div className="mt-auto">
                <Link to={to} className={`${btnClass} w-full text-sm py-2`}>
                  {cta}
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="page-container border-t border-gray-800/50 pt-12 pb-16">
        <div className="text-center mb-10">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple, fast, student-first.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', title: 'Upload', desc: 'Share your exam paper with the community in seconds.' },
            { step: '02', title: 'Discover', desc: 'Browse and filter papers by course, slot, or exam type.' },
            { step: '03', title: 'Prepare', desc: 'Download, study, and ace your exams with confidence.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-600/20 border border-primary-600/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold text-sm">{step}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
