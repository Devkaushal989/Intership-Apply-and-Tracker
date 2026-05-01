import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ── Candidate Auth ──
import Login    from './pages/Login'
import Register from './pages/Register'

// ── Candidate Dashboard ──
import CandidateDashboard from './pages/CandidateDashboard'

// ── Admin Dashboard ──
import AdminDashboard from './pages/Dashboard'

// ── Company Auth & Dashboard ──
import CompanyLogin     from './pages/CompanyLogin'
import CompanyRegister  from './pages/CompanyRegister'
import CompanyDashboard from './pages/CompanyDashboard'

// ─────────────────────────────────────────
//  Auth Guards
// ─────────────────────────────────────────
const isAuth        = () => !!localStorage.getItem('token')
const isCompanyAuth = () => !!localStorage.getItem('companyToken')
const isAdminAuth   = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return !!localStorage.getItem('token') && user?.role === 'admin'
  } catch {
    return false
  }
}

const PrivateRoute       = ({ children }) =>
  isAuth()        ? children : <Navigate to="/login"           replace />

const CompanyRoute       = ({ children }) =>
  isCompanyAuth() ? children : <Navigate to="/company/login"   replace />

const PublicRoute        = ({ children }) =>
  !isAuth()       ? children : <Navigate to="/dashboard"       replace />

const CompanyPublicRoute = ({ children }) =>
  !isCompanyAuth()? children : <Navigate to="/company/dashboard" replace />

const AdminRoute = ({ children }) =>
  isAdminAuth() ? children : <Navigate to="/login" replace />

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Candidate Auth ── */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ── Candidate Dashboard ── */}
        <Route path="/dashboard"
          element={<PrivateRoute><CandidateDashboard /></PrivateRoute>}
        />

  
        {/* ── Company Dashboard ── */}
        <Route path="/company/dashboard"
          element={<CompanyRoute><CompanyDashboard /></CompanyRoute>}
        />

        {/* ── Admin Dashboard ── */}
        <Route path="/admindashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />

        {/* 404 */}
        <Route path="*" element={<h1 style={{ padding: 40, color: '#fff', textAlign: 'center' }}>404 — Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App  