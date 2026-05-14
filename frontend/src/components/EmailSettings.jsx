import React from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function EmailSettings({ email }) {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'Email Addresses' }
      ]} />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Email Addresses</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>View and manage the email addresses associated with your account.</p>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#999', display: 'block' }}>PRIMARY EMAIL</span>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>{email}</span>
          </div>
          <span style={{ background: 'rgb(228, 241, 204)', color: 'rgb(94, 148, 0)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>VERIFIED</span>
        </div>
        <button style={{ color: 'rgb(94, 148, 0)', background: 'none', border: 'none', padding: 0, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>CHANGE EMAIL</button>
      </div>
    </div>
  )
}
