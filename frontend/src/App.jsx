import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login    from './pages/Login'
import Register from './pages/Register'

import CandidateDashboard from './pages/CandidateDashboard'

import AdminDashboard from './pages/Dashboard'

import CompanyLogin     from './pages/CompanyLogin'
import CompanyRegister  from './pages/CompanyRegister'
import CompanyDashboard from './pages/CompanyDashboard'

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

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/dashboard"
          element={<PrivateRoute><CandidateDashboard /></PrivateRoute>}
        />

  
        <Route path="/company/dashboard"
          element={<CompanyRoute><CompanyDashboard /></CompanyRoute>}
        />

        <Route path="/admindashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />

        <Route path="*" element={<h1 style={{ padding: 40, color: '#fff', textAlign: 'center' }}>404 — Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App  