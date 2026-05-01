import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#111"/>
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

// Reusable plain input row
function PlainInput({ placeholder, type = 'text', value, onChange, error, showToggle, showPwd, onToggle }) {
  return (
    <div className="field">
      <div style={{ position: 'relative' }}>
        <input
          className={`input-plain ${error ? 'input-error' : ''}`}
          type={showToggle ? (showPwd ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          style={{ paddingRight: showToggle ? 44 : undefined }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            style={{
              position: 'absolute', right: 14, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', color: '#9ca3af',
              display: 'flex', alignItems: 'center', padding: 0,
            }}
          >
            {showPwd ? <EyeOn /> : <EyeOff />}
          </button>
        )}
      </div>
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  )
}

const TABS = [
  { id: 'candidate',    label: 'Candidate',    icon: <svg xmlns="http://www.w3.org/2000/svg"
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

    </svg> },
  { id: 'organization', label: 'Organization', icon: <svg xmlns="http://www.w3.org/2000/svg"
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

    </svg> },
]

export default function Register() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('candidate')

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [agree, setAgree]       = useState(false)

  const [industry, setIndustry] = useState('')
  const [website, setWebsite]   = useState('')

  const [showPwd, setShowPwd]     = useState(false)
  const [showCfm, setShowCfm]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [apiError, setApiError]   = useState('')
  const [loading, setLoading]     = useState(false)

  const switchTab = (tab) => {
    setActiveTab(tab)
    setName(''); setEmail(''); setPassword(''); setConfirm('')
    setIndustry(''); setWebsite(''); setAgree(false)
    setErrors({}); setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!name.trim())           e.name     = 'Name is required'
    if (!email)                 e.email    = 'Email is required'
    if (!password)              e.password = 'Password is required'
    if (confirm !== password)   e.confirm  = 'Passwords do not match'
    if (!agree)                 e.agree    = 'You must agree to continue'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const endpoint = activeTab === 'organization'
        ? 'http://localhost:5000/api/company/register'
        : 'http://localhost:5000/api/auth/register'

      const body = activeTab === 'organization'
        ? { name, email, password, industry, website }
        : { name, email, password }

      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Registration failed'); return }

      if (activeTab === 'organization') {
        localStorage.setItem('companyToken',   data.token)
        localStorage.setItem('companyProfile', JSON.stringify(data.company))
        navigate('/company/dashboard')
      } else {
        navigate('/login')
      }

    } catch (err) {
      setApiError('Cannot connect to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">InternBuddy</span>
        </div>

        <h2 className="auth-title">Create your account</h2>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f5f6f8',
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
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
                color:      activeTab === tab.id ? '#111' : '#6b7280',
                boxShadow:  activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {apiError && <div className="api-error-banner">⚠ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">

            <PlainInput
              placeholder={activeTab === 'organization' ? 'Company Name' : 'Full Name'}
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
              error={errors.name}
            />

            <PlainInput
              placeholder={activeTab === 'organization' ? 'Company Email' : 'Email Address'}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              error={errors.email}
            />

            {activeTab === 'organization' && (
              <>
                <PlainInput
                  placeholder="Industry (e.g. Technology, Finance)"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                />
                <PlainInput
                  placeholder="Website URL (optional)"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </>
            )}

            <PlainInput
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              error={errors.password}
              showToggle showPwd={showPwd}
              onToggle={() => setShowPwd(v => !v)}
            />

            <PlainInput
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })) }}
              error={errors.confirm}
              showToggle showPwd={showCfm}
              onToggle={() => setShowCfm(v => !v)}
            />

          </div>

          {activeTab === 'organization' && (
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14, lineHeight: 1.5 }}>
              ⚠ One email = one company account. Duplicate emails are not allowed.
            </p>
          )}

          <div className={`agree-row ${errors.agree ? 'agree-error' : ''}`}>
            <input
              type="checkbox" id="agree"
              checked={agree}
              onChange={e => { setAgree(e.target.checked); setErrors(er => ({ ...er, agree: '' })) }}
            />
            <label htmlFor="agree">
              I agree to the <span className="text-link-inline">Terms of Service</span> and{' '}
              <span className="text-link-inline">Privacy Policy</span>
            </label>
          </div>
          {errors.agree && (
            <p className="error-msg" style={{ marginTop: '-10px', marginBottom: 14 }}>
              ⚠ {errors.agree}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? 'Creating account...'
              : activeTab === 'organization' ? 'Register Company' : 'Register'
            }
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="footer-link">Sign In</Link>
        </p>

      </div>
    </div>
  )
}