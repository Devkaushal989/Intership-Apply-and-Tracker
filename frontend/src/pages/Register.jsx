import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogoIcon, EyeOn, EyeOff } from '../components/Icons'
import '../App.css'


function FloatingInput({ label, type = 'text', value, onChange, error, showToggle, showPwd, onToggle }) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div className="field">
      <div className={`float-wrap ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <label className={`float-label ${lifted ? 'lifted' : ''} ${error ? 'label-error' : focused ? 'label-focused' : ''}`}>
          {label}
        </label>
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

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm]               = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree]             = useState(false)
  const [errors, setErrors]           = useState({})
  const [apiError, setApiError]       = useState('')
  const [loading, setLoading]         = useState(false)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())              e.name     = 'Full name is required'
    if (!form.email)                    e.email    = 'Email is required'
    if (!form.password)                 e.password = 'Password is required'
    if (form.confirm !== form.password) e.confirm  = 'Passwords do not match'
    if (!agree)                         e.agree    = 'You must agree to continue'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.message || 'Registration failed. Please try again.')
        return
      }

      // ✅ Success → go to login
      navigate('/login')

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

        <h2 className="auth-title">Create your account</h2>

        {/* API Error Banner */}
        {apiError && (
          <div className="api-error-banner">
            ⚠ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">

            <FloatingInput
              label="Full Name"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
            />
            <FloatingInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
            />
            <FloatingInput
              label="Password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              showToggle
              showPwd={showPwd}
              onToggle={() => setShowPwd(v => !v)}
            />
            <FloatingInput
              label="Confirm Password"
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              showToggle
              showPwd={showConfirm}
              onToggle={() => setShowConfirm(v => !v)}
            />

          </div>

          <div className={`agree-row ${errors.agree ? 'agree-error' : ''}`}>
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={e => { setAgree(e.target.checked); setErrors(er => ({ ...er, agree: '' })) }}
            />
            <label htmlFor="agree">
              I agree to the <span className="text-link-inline">Terms of Service</span> and{' '}
              <span className="text-link-inline">Privacy Policy</span>
            </label>
          </div>
          {errors.agree && (
            <p className="error-msg" style={{ marginTop: '-10px', marginBottom: '14px' }}>
              ⚠ {errors.agree}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
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