import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function EmailSettings({ email, onUpdateUser }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [newEmail, setNewEmail] = useState(email || '')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleStartEdit = () => {
    setEditing(true)
    setNewEmail(email || '')
    setConfirmEmail('')
    setError('')
    setSuccess('')
  }

  const handleSaveEmail = () => {
    setError('')
    setSuccess('')

    if (!newEmail.trim() || !confirmEmail.trim()) {
      setError('Both email fields are required.')
      return
    }
    if (newEmail.trim() !== confirmEmail.trim()) {
      setError('The email addresses do not match.')
      return
    }
    if (!newEmail.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    if (onUpdateUser) {
      onUpdateUser({ email: newEmail.trim() })
      setSuccess('Your email has been updated successfully.')
      setEditing(false)
    }
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'Email Settings' }
      ]} />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Email Settings</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Keep your account email up to date and manage notification delivery preferences.</p>
      </div>

      <div style={{ display: 'grid', gap: '24px', maxWidth: '680px' }}>
        <section style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.08em', color: '#999' }}>PRIMARY EMAIL</p>
              <p style={{ margin: '10px 0 0', fontSize: '16px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>{email}</p>
            </div>
            <span style={{ background: 'rgb(228, 241, 204)', color: 'rgb(94, 148, 0)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>VERIFIED</span>
          </div>
          <p style={{ marginTop: '18px', color: '#666', lineHeight: 1.75 }}>This is the email used for order notifications, account recovery, and promotional updates. Update it whenever your primary inbox changes.</p>
          <button onClick={handleStartEdit} style={{ marginTop: '24px', background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Change email</button>
        </section>

        {editing && (
          <section style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>Update primary email</p>
            <p style={{ margin: '10px 0 20px', color: '#666', lineHeight: 1.75 }}>Enter the email address you want to use for account notifications and recovery.</p>
            <input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="New email address"
              style={{ width: '100%', marginBottom: '14px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
            <input
              type="email"
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              placeholder="Confirm email address"
              style={{ width: '100%', marginBottom: '14px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
            {error && <p style={{ color: 'rgb(204, 0, 0)', margin: '0 0 14px', fontSize: '14px' }}>{error}</p>}
            {success && <p style={{ color: 'rgb(20, 120, 60)', margin: '0 0 14px', fontSize: '14px' }}>{success}</p>}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleSaveEmail} style={{ background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Save changes</button>
              <button onClick={() => setEditing(false)} style={{ background: '#f6f6f6', color: '#333', border: '1px solid #ddd', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
            </div>
          </section>
        )}

        <section style={{ background: '#fff', padding: '26px', borderRadius: '16px', border: '1px solid #eee', color: '#666', fontSize: '14px', lineHeight: 1.75 }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>Email preferences</p>
          <p style={{ margin: 0 }}>You can use this account email for order updates, receipts, delivery notifications, and support messages.</p>
        </section>
      </div>
    </div>
  )
}
