import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Addresses({ addresses = [], selectedAddressId, onSelectAddress, onAddAddress, onRemoveAddress }) {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [formState, setFormState] = useState({ label: 'Home', line1: '', city: '', state: '', postal: '' })

  useEffect(() => {
    if (editingAddressId) {
      const existing = addresses.find((address) => address.id === editingAddressId)
      if (existing) {
        const [line1, city, state, postal] = existing.address.split(',').map((part) => part.trim())
        setFormState({
          label: existing.label || existing.title || 'Home',
          line1: line1 || '',
          city: city || '',
          state: state || '',
          postal: postal || ''
        })
        setShowForm(true)
        return
      }
    }

    if (!editingAddressId) {
      setFormState({ label: 'Home', line1: '', city: '', state: '', postal: '' })
    }
  }, [editingAddressId, addresses])

  const resetForm = () => {
    setEditingAddressId(null)
    setFormState({ label: 'Home', line1: '', city: '', state: '', postal: '' })
    setShowForm(false)
  }

  const handleSave = () => {
    if (!formState.line1.trim() || !formState.city.trim() || !formState.postal.trim()) return

    const addressPayload = {
      id: editingAddressId || `addr-${Date.now()}`,
      label: formState.label || 'Home',
      title: formState.label || 'Home',
      address: `${formState.line1.trim()}, ${formState.city.trim()}, ${formState.state.trim()}, ${formState.postal.trim()}`,
      details: 'Saved delivery address'
    }

    onAddAddress(addressPayload)
    resetForm()
  }

  const startEdit = (addressId) => {
    setEditingAddressId(addressId)
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'Delivery Addresses' }
      ]} />

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Delivery Addresses</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Keep your delivery information current so checkout stays fast and reliable.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <div style={{ display: 'grid', gap: '18px' }}>
          {addresses.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '40px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px', color: '#444', fontSize: '18px', fontWeight: 700 }}>No saved addresses yet</p>
              <p style={{ margin: 0, color: '#666' }}>Add a delivery address to speed up checkout and ensure fast shipping.</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} style={{ background: '#fff', borderRadius: '16px', border: address.id === selectedAddressId ? '2px solid rgb(94, 148, 0)' : '1px solid #eee', padding: '22px', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>{address.title}</p>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#777' }}>{address.details || 'Delivery address'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {address.id === selectedAddressId && <span style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '12px', background: 'rgb(228, 241, 204)', color: 'rgb(94, 148, 0)', fontWeight: 700 }}>Selected</span>}
                    <button type="button" onClick={() => onRemoveAddress(address.id)} style={{ border: '1px solid rgb(212, 64, 64)', background: 'transparent', color: 'rgb(212, 64, 64)', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    <button type="button" onClick={() => startEdit(address.id)} style={{ border: '1px solid #ddd', background: '#fff', color: '#333', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#333', lineHeight: 1.75 }}>{address.address}</p>
                <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => onSelectAddress(address.id)} style={{ padding: '12px 18px', borderRadius: '10px', border: 'none', background: address.id === selectedAddressId ? 'rgb(94, 148, 0)' : '#f2f2f2', color: address.id === selectedAddressId ? '#fff' : '#333', cursor: 'pointer', fontWeight: 700 }}>Use for checkout</button>
                  <button type="button" onClick={() => navigate('/checkout')} style={{ padding: '12px 18px', borderRadius: '10px', border: '1px solid #ddd', background: '#fff', color: '#333', cursor: 'pointer', fontWeight: 700 }}>Checkout now</button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '26px', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.08em', color: '#999' }}>MANAGE ADDRESSES</p>
              <h2 style={{ margin: '10px 0 0', fontSize: '20px', fontWeight: 700, color: 'rgb(32, 32, 32)' }}>{editingAddressId ? 'Edit address' : 'Add a new address'}</h2>
            </div>
            <button type="button" onClick={() => setShowForm((current) => !current)} style={{ background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', fontWeight: 700 }}>{showForm ? 'Hide form' : '+ New address'}</button>
          </div>

          {showForm && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <input
                type="text"
                value={formState.label}
                onChange={(e) => setFormState((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Label (Home / Office)"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
              />
              <input
                type="text"
                value={formState.line1}
                onChange={(e) => setFormState((prev) => ({ ...prev, line1: e.target.value }))}
                placeholder="Address line"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
              />
              <input
                type="text"
                value={formState.city}
                onChange={(e) => setFormState((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
              />
              <input
                type="text"
                value={formState.state}
                onChange={(e) => setFormState((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State / Region"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
              />
              <input
                type="text"
                value={formState.postal}
                onChange={(e) => setFormState((prev) => ({ ...prev, postal: e.target.value }))}
                placeholder="PIN / ZIP code"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button type="button" onClick={handleSave} style={{ background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', fontWeight: 700 }}>{editingAddressId ? 'Update address' : 'Save address'}</button>
                <button type="button" onClick={resetForm} style={{ background: '#f6f6f6', color: '#333', border: '1px solid #ddd', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', color: '#666', fontSize: '14px', lineHeight: 1.75 }}>
            <p style={{ margin: '0 0 10px' }}>Saved addresses are used for delivery estimates, shipping fees, and faster checkout.</p>
            <p style={{ margin: 0 }}>Edit any address to keep your account delivery details up to date.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
