import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#4f46e5"/>
    <path d="M10 22l5-5 4 4 7-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="12" r="2.5" fill="#fff"/>
  </svg>
)

export default function CompanyLogin() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    const e = {}
    if (!email)    e.email    = 'Email is required'
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
      const res  = await fetch('http://localhost:5000/api/company/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Login failed'); return }

      localStorage.setItem('companyToken',   data.token)
      localStorage.setItem('companyProfile', JSON.stringify(data.company))
      navigate('/company/dashboard')
    } catch (err) {
      setApiError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">InternBuddy</span>
        </div>

        <h2 className="auth-title" style={{ fontSize: 22, marginBottom: 6 }}>Company Sign In</h2>
        <p style={{ textAlign: 'center', fontSize: 13.5, color: '#6b7280', marginBottom: 24 }}>
          Access your organization dashboard
        </p>

        {apiError && <div className="api-error-banner">⚠ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <div className="field">
              <input
                className={`input-plain ${errors.email ? 'input-error' : ''}`}
                type="email"
                placeholder="Company Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
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
              />
              {errors.password && <p className="error-msg">⚠ {errors.password}</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New company?{' '}
          <Link to="/company/register" className="footer-link">Register your company</Link>
        </p>
      </div>
    </div>
  )
}