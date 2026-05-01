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

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const EyeOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

function FloatingInput({ label, type = 'text', value, onChange, error, showToggle, showPwd, onToggle }) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  return (
    <div className="field">
      <div className={`float-wrap ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <label className={`float-label ${lifted ? 'lifted' : ''} ${error ? 'label-error' : focused ? 'label-focused' : ''}`}>{label}</label>
        <input
          className="float-input"
          type={showToggle ? (showPwd ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
        />
        {showToggle && (
          <button className="field-icon-btn" type="button" onClick={onToggle} tabIndex={-1}>
            {showPwd ? <EyeOn /> : <EyeOff />}
          </button>
        )}
      </div>
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  )
}

export default function CompanyRegister() {
  const navigate = useNavigate()
  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '', industry: '', website: '' })
  const [showPwd, setShowPwd]     = useState(false)
  const [showCfm, setShowCfm]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [apiError, setApiError]   = useState('')
  const [loading, setLoading]     = useState(false)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())              e.name     = 'Company name is required'
    if (!form.email)                    e.email    = 'Email is required'
    if (!form.password)                 e.password = 'Password is required'
    if (form.confirm !== form.password) e.confirm  = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/company/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
          industry: form.industry,
          website:  form.website,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Registration failed'); return }

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
        <h2 className="auth-title">Register Your Company</h2>

        {apiError && <div className="api-error-banner">⚠ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <FloatingInput label="Company Name *"  value={form.name}     onChange={set('name')}     error={errors.name} />
            <FloatingInput label="Company Email *" type="email" value={form.email}    onChange={set('email')}    error={errors.email} />
            <FloatingInput label="Industry"        value={form.industry} onChange={set('industry')} error={errors.industry} />
            <FloatingInput label="Website URL"     value={form.website}  onChange={set('website')}  error={errors.website} />
            <FloatingInput label="Password *"      value={form.password} onChange={set('password')} error={errors.password} showToggle showPwd={showPwd} onToggle={() => setShowPwd(v => !v)} />
            <FloatingInput label="Confirm Password *" value={form.confirm} onChange={set('confirm')} error={errors.confirm} showToggle showPwd={showCfm} onToggle={() => setShowCfm(v => !v)} />
          </div>

          <p style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 18, lineHeight: 1.5 }}>
            ⚠ One email = one company account. You cannot register the same email twice.
          </p>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{' '}
          <Link to="/company/login" className="footer-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}