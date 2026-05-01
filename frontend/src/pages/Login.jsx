import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#111" />
    <path d="M10 22l5-5 4 4 7-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="12" r="2.5" fill="#fff" />
  </svg>
)

const TABS = [
  {
    id: 'candidate', label: 'Candidate', icon: <svg xmlns="http://www.w3.org/2000/svg"
      width="28" height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">

      <polygon points="12 3 2 8 12 13 22 8 12 3"></polygon>

      <path d="M6 10v4c0 2 3 4 6 4s6-2 6-4v-4"></path>

      <line x1="22" y1="8" x2="22" y2="14"></line>
      <circle cx="22" cy="16" r="1"></circle>

    </svg>
  },
  {
    id: 'organization', label: 'Organization', icon: <svg xmlns="http://www.w3.org/2000/svg"
      width="28" height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">

      <rect x="4" y="2" width="16" height="20" rx="2"></rect>

      <line x1="8" y1="6" x2="8" y2="6"></line>
      <line x1="12" y1="6" x2="12" y2="6"></line>
      <line x1="16" y1="6" x2="16" y2="6"></line>

      <line x1="8" y1="10" x2="8" y2="10"></line>
      <line x1="12" y1="10" x2="12" y2="10"></line>
      <line x1="16" y1="10" x2="16" y2="10"></line>

      <line x1="8" y1="14" x2="8" y2="14"></line>
      <line x1="12" y1="14" x2="12" y2="14"></line>
      <line x1="16" y1="14" x2="16" y2="14"></line>

      <rect x="10" y="17" width="4" height="5"></rect>

    </svg>
  },
  {
    id: 'admin', label: 'Admin', icon: <svg xmlns="http://www.w3.org/2000/svg"
      width="28" height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">

      <circle cx="9" cy="7" r="3"></circle>
      <path d="M3 21v-2c0-3 2-5 6-5s6 2 6 5v2"></path>

      <path d="M17 8l4 2v4c0 3-2 5-4 6-2-1-4-3-4-6v-4z"></path>

      <polyline points="15.5 13 17 14.5 19.5 12"></polyline>

    </svg>
  },
]

export default function Login() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset form when switching tabs
  const switchTab = (tab) => {
    setActiveTab(tab)
    setEmail(''); setPassword('')
    setErrors({}); setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // Different API endpoints per tab
      const endpoint =
        activeTab === 'organization'
          ? 'http://localhost:5000/api/company/login'
          : activeTab === 'admin'
            ? 'http://localhost:5000/api/admin/login'
          : 'http://localhost:5000/api/auth/login'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data.message || 'Login failed. Please try again.')
        return
      }

      // Store token based on tab
      if (activeTab === 'organization') {
        localStorage.setItem('companyToken', data.token)
        localStorage.setItem('companyProfile', JSON.stringify(data.company))
        navigate('/company/dashboard')
      } else if (activeTab === 'admin') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/admin/dashboard')
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }

    } catch (err) {
      setApiError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const placeholderText =
    activeTab === 'organization' ? 'Company Email' :
      activeTab === 'admin' ? 'Admin Email' : 'Email'

  const btnText =
    activeTab === 'organization' ? 'Sign In to Dashboard' :
      activeTab === 'admin' ? 'Sign In as Admin' : 'Sign In'

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">InternBuddy</span>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f5f6f8',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          gap: 2,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.18s',
                background: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#111' : '#6b7280',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 5,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <p style={{
          textAlign: 'center', fontSize: 13.5,
          color: '#6b7280', marginBottom: 20,
        }}>
          {activeTab === 'candidate' && 'Sign in to browse & track internships'}
          {activeTab === 'organization' && 'Sign in to manage your internship listings'}
          {activeTab === 'admin' && 'Admin access only'}
        </p>

        {/* API Error */}
        {apiError && <div className="api-error-banner">⚠ {apiError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">

            <div className="field">
              <input
                className={`input-plain ${errors.email ? 'input-error' : ''}`}
                type="email"
                placeholder={placeholderText}
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                autoComplete="email"
              />
              {errors.email && <p className="error-msg">⚠ {errors.email}</p>}
            </div>

            <div className="field">
              <input
                className={`input-plain ${errors.password ? 'input-error' : ''}`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                autoComplete="current-password"
              />
              {errors.password && <p className="error-msg">⚠ {errors.password}</p>}
            </div>

          </div>

          {/* Remember + Forgot */}
          <div className="row-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : btnText}
          </button>
        </form>

        {activeTab === 'candidate' && (
          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">Sign Up</Link>
          </p>
        )}
        {activeTab === 'organization' && (
          <p className="auth-footer">
            New company?{' '}
            <Link to="/register" className="footer-link">Register your company</Link>
          </p>
        )}
        {activeTab === 'admin' && (
          <p className="auth-footer" style={{ color: '#9ca3af', fontSize: 12 }}>
            Admin accounts are created by the system only.
          </p>
        )}

      </div>
    </div>
  )
}