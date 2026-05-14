import React, { useState } from 'react'
import logoImage from '../../logo.png'
import { API_BASE } from '../config'

export default function LoginSignup({ onLoginComplete, onBackToLanding, onClose, onShowTerms, onShowPrivacy, modal }) {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (isSignup && formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      const user = await response.json()
      localStorage.setItem('userId', user.id)
      localStorage.setItem('username', formData.username)
      onLoginComplete(user.id)
    } catch (submitError) {
      setError(submitError.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `guest_${Date.now()}`,
          email: `guest_${Date.now()}@example.com`
        })
      })
      const user = await response.json()
      localStorage.setItem('userId', user.id)
      localStorage.setItem('username', 'Guest User')
      onLoginComplete(user.id)
    } catch (guestError) {
      setError('Failed to create guest account')
    } finally {
      setLoading(false)
    }
  }

  if (modal) {
    return (
      <div style={{padding: '28px', position: 'relative', display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'row', flex: 1, position: 'relative'}}>
          <div style={{paddingTop: '34px', paddingBottom: '24px', backgroundColor: 'rgb(238, 238, 238)', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', paddingLeft: '22px', paddingRight: '22px'}}>
            <div style={{textAlign: 'center', color: 'rgb(102, 82, 0)', fontSize: '12px', marginBottom: '16px'}}>Why choose Bigbasket?</div>
            <div style={{display: 'grid', gridTemplateColumns: '64px 64px', gap: '22px 26px', borderBottom: '0.8px solid rgb(0, 0, 0)', paddingBottom: '22px'}}>
              <div><svg width="60" height="46" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="17" r="15" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M31.234 22.863c-.252.465-1.146 1.855-2.22 1.465a.15.15 0 0 0-.102 0c-1.074.39-1.969-1-2.22-1.465-.408-.756-.887-2.141-.155-3.188.809-1.157 2.007-.436 2.339-.212a.155.155 0 0 0 .174 0c.332-.224 1.53-.945 2.338.212.732 1.047.254 2.432-.154 3.188Zm.776-3.646c-.559-.8-1.26-.968-1.75-.968a2.44 2.44 0 0 0-.694.107.161.161 0 0 1-.203-.177c.04-.332.111-.741.236-1.158a.329.329 0 0 0-.194-.4l-.119-.046a.317.317 0 0 0-.416.21c-.136.451-.233 1.117-.276 1.445a.159.159 0 0 1-.203.136 2.456 2.456 0 0 0-.725-.117c-.49 0-1.191.168-1.75.968-.437.625-.605 1.41-.486 2.272.106.768.417 1.43.593 1.755.246.454 1.152 1.938 2.509 1.938.145 0 .289-.017.43-.052.143.035.287.052.432.052 1.356 0 2.263-1.483 2.509-1.938.175-.326.486-.987.593-1.755.119-.861-.05-1.647-.486-2.273Z" fill="#606060"/></svg></div>
              <div />
              <div />
              <div />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '22px', gap: '10px'}}>
              <span style={{color: 'rgb(48, 48, 48)', fontSize: '10px'}}>Find us on</span>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.75" y="0.75" width="30.5" height="30.501" rx="4.25" stroke="#000" strokeWidth="0.5"/></svg>
            </div>
          </div>

          <div style={{paddingTop: '24px', paddingBottom: '24px', paddingLeft: '48px', paddingRight: '48px', backgroundColor: 'rgb(0, 0, 0)', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', color: 'white'}}>
            <div style={{fontSize: '18px', fontWeight: 700, marginBottom: '6px'}}>Login/ Sign up</div>
            <div style={{fontSize: '12px', marginBottom: '12px'}}>Using OTP</div>
            <div style={{borderBottom: '0.8px solid rgb(255, 136, 0)', width: '2.625rem', marginBottom: '20px'}} />
            <form onSubmit={handleSubmit} style={{maxWidth: '280px'}}>
              <input name="multiform" placeholder="Enter Phone number/ Email Id" value={formData.email} onChange={(e) => handleChange(e)} style={{width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '0.8px solid rgb(96, 96, 96)', fontSize: '14px', boxSizing: 'border-box'}} />
              <button type="submit" disabled={loading} style={{width: '100%', padding: '8px', backgroundColor: 'rgb(204, 0, 0)', color: 'rgb(250, 230, 230)', border: '0.8px solid rgb(250, 230, 230)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, opacity: loading ? 0.5 : 1}}>
                {loading ? 'Please wait' : 'Continue'}
              </button>
            </form>
            <div style={{fontSize: '12px', marginTop: '12px', lineHeight: '1.4'}}>By continuing, I accept TCP - <a href="#terms" style={{color: 'rgb(200, 200, 200)', textDecoration: 'underline'}}>Terms</a> &amp; <a href="#privacy" style={{color: 'rgb(200, 200, 200)', textDecoration: 'underline'}}>Privacy</a></div>
            <div style={{fontSize: '11px', marginTop: '8px', lineHeight: '1.3', color: 'rgb(170, 170, 170)'}}>reCAPTCHA and Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color: 'rgb(170, 170, 170)', textDecoration: 'underline'}}>Privacy</a> &amp; <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{color: 'rgb(170, 170, 170)', textDecoration: 'underline'}}>Terms</a></div>
          </div>

          <button type="button" onClick={onClose} style={{position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '4px'}}>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="m16.768 15 5.366-5.366a1.249 1.249 0 1 0-1.768-1.768L15 13.233 9.634 7.865a1.249 1.249 0 1 0-1.768 1.768L13.233 15l-5.367 5.366a1.249 1.249 0 1 0 1.768 1.768L15 16.767l5.366 5.367a1.247 1.247 0 0 0 1.768 0 1.249 1.249 0 0 0 0-1.768L16.768 15Z" fill="#fff"/></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-signup-page">
      <div className="login-container">
        <button className="back-button" onClick={onBackToLanding} type="button">Back to shop</button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-brand">
              <img className="login-brand-mark" src={logoImage} alt="SmallBasket logo" />
              <h1>Small Basket</h1>
            </div>
            <p>Sign in, create an account, or continue as a guest without breaking the browsing flow.</p>
          </div>

          <div className="login-tabs">
            <button className={`tab ${!isSignup ? 'active' : ''}`} onClick={() => setIsSignup(false)} type="button">Login</button>
            <button className={`tab ${isSignup ? 'active' : ''}`} onClick={() => setIsSignup(true)} type="button">Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label>Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" disabled={loading} /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" disabled={loading} /></div>
            <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" disabled={loading} /></div>
            {isSignup && (<div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" disabled={loading} /></div>)}
            <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}</button>
          </form>

          <div className="divider">or</div>
          <button type="button" className="guest-button" onClick={handleGuestLogin} disabled={loading}>Continue as Guest</button>
          <p className="login-footer">{isSignup ? 'Already have an account?' : "Don't have an account?"} <button type="button" className="toggle-button" onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Login' : 'Sign Up'}</button></p>
          <p className="legal-links">By continuing you agree to our <button type="button" className="link-button" onClick={onShowTerms}>Terms & Conditions</button> and <button type="button" className="link-button" onClick={onShowPrivacy}>Privacy Policy</button>.</p>
        </div>
      </div>
    </div>
  )
}
