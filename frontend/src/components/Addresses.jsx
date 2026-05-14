import React from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Addresses() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'Delivery Addresses' }
      ]} />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Delivery Addresses</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Manage your delivery addresses for a faster checkout experience.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <button style={{ 
          height: '200px', border: '2px dashed #ddd', background: '#f9f9f9', borderRadius: '8px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          cursor: 'pointer', color: '#666' 
        }}>
          <span style={{ fontSize: '40px', marginBottom: '10px' }}>+</span>
          <span style={{ fontWeight: 600 }}>ADD NEW ADDRESS</span>
        </button>
      </div>
    </div>
  )
}
