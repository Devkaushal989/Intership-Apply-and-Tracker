import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogoIcon, EyeOn, EyeOff } from '../components/Icons'

import '../App.css'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
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
      const res  = await fetch('http://localhost:5000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.message || 'Login failed. Please try again.')
        return
      }

      // Save token & user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.user))

      navigate('/dashboard')

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

        {/* API Error Banner */}
        {apiError && (
          <div className="api-error-banner">
            ⚠ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">

            {/* Email */}
            <div className="field">
              <input
                className={`input-plain ${errors.email ? 'input-error' : ''}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                autoComplete="email"
              />
              {errors.email && <p className="error-msg">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="footer-link">Sign Up</Link>
        </p>

      </div>
    </div>
  )
}