import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthGate from './components/AuthGate'
import PageTransition from './components/PageTransition'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import SlotPapersPage from './pages/SlotPapersPage'
import PYQsPage from './pages/PYQsPage'
import CalculatorPage from './pages/CalculatorPage'
import DashboardPage from './pages/DashboardPage'
import AdminRoutePage from './pages/AdminRoutePage'

function App() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <AuthPage />
                </PageTransition>
              }
            />
            <Route
              path="/home"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
          <Route
            path="/upload"
            element={
              <PageTransition>
                <AuthGate>
                  <UploadPage />
                </AuthGate>
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <AuthGate>
                  <DashboardPage />
                </AuthGate>
              </PageTransition>
            }
          />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <AdminRoutePage />
                </PageTransition>
              }
            />
            <Route
              path="/slot-papers"
              element={
                <PageTransition>
                  <SlotPapersPage />
                </PageTransition>
              }
            />
            <Route
              path="/pyqs"
              element={
                <PageTransition>
                  <PYQsPage />
                </PageTransition>
              }
            />
            <Route
              path="/calculator"
              element={
                <PageTransition>
                  <CalculatorPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {showNavbar && <Footer />}
    </div>
  )
}

export default App
