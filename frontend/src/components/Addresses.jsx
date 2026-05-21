import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Addresses({ addresses = [], selectedAddressId, onSelectAddress, onAddAddress, onRemoveAddress }) {
  const navigate = useNavigate()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Home', line1: '', city: '', state: '', postal: '' })

  const handleAddAddress = () => {
    if (!newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.postal.trim()) return

    onAddAddress({
      id: `addr-${Date.now()}`,
      label: newAddress.label || 'Home',
      title: newAddress.label || 'Home',
      address: `${newAddress.line1}, ${newAddress.city}, ${newAddress.state}, ${newAddress.postal}`,
      details: 'Saved delivery address'
    })

    setNewAddress({ label: 'Home', line1: '', city: '', state: '', postal: '' })
    setShowAddForm(false)
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'Delivery Addresses' }
      ]} />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Delivery Addresses</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Manage saved addresses for fast checkout and accurate delivery.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {addresses.map((address) => (
            <div key={address.id} style={{ background: '#fff', borderRadius: '12px', border: address.id === selectedAddressId ? '2px solid rgb(94, 148, 0)' : '1px solid #eee', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>{address.title}</span>
                  <span style={{ fontSize: '12px', color: '#777' }}>{address.details || 'Delivery address'}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {address.id === selectedAddressId && <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgb(228, 241, 204)', color: 'rgb(94, 148, 0)', fontWeight: 700 }}>Selected</span>}
                  <button type="button" onClick={() => onRemoveAddress && onRemoveAddress(address.id)} style={{ border: 'none', background: 'none', color: 'rgb(204, 0, 0)', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                </div>
              </div>
              <p style={{ margin: 0, color: '#444', lineHeight: 1.6 }}>{address.address}</p>
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button type="button" onClick={() => onSelectAddress && onSelectAddress(address.id)} style={{ flex: 1, padding: '10px 14px', background: address.id === selectedAddressId ? 'rgb(94, 148, 0)' : '#f7f7f7', color: address.id === selectedAddressId ? '#fff' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Use this address</button>
                <button type="button" onClick={() => navigate('/checkout')} style={{ flex: 1, padding: '10px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Checkout</button>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Your delivery address</p>
              <h2 style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>Add a new address</h2>
            </div>
            <button type="button" onClick={() => setShowAddForm((current) => !current)} style={{ background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontWeight: 700 }}>+ New</button>
          </div>

          {showAddForm && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {['label', 'line1', 'city', 'state', 'postal'].map((field) => (
                <input
                  key={field}
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={field === 'label' ? 'Label (Home / Office)' : field === 'line1' ? 'Address line' : field === 'postal' ? 'PIN / ZIP' : field.charAt(0).toUpperCase() + field.slice(1)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                />
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" onClick={handleAddAddress} style={{ background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 700 }}>Save address</button>
                <button type="button" onClick={() => setShowAddForm(false)} style={{ background: '#f7f7f7', color: '#333', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '22px', color: '#666', fontSize: '14px', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 10px' }}>Select or save addresses you use frequently. Your selected address will be used for checkout and delivery estimation.</p>
            <p style={{ margin: 0 }}>Tip: Use the checkout page to add a live GPS address from your device.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
