import React, { useMemo, useState } from 'react'

export default function DeliverySelection({
  open,
  addresses,
  selectedAddressId,
  selectedSlot,
  onSelectAddress,
  onSelectSlot,
  onUseCurrentLocation,
  onAddAddress,
  onCancel,
  onConfirm,
  checkoutLoading
}) {
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    line1: '',
    city: '',
    state: '',
    postal: ''
  })

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  )

  const deliverySlots = [
    'Today, 12 - 2 PM',
    'Today, 3 - 5 PM',
    'Tomorrow, 9 - 11 AM',
    'Tomorrow, 4 - 6 PM'
  ]

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNewAddress = () => {
    if (!newAddress.label.trim() || !newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.postal.trim()) {
      return
    }

    onAddAddress({
      id: `address-${Date.now()}`,
      label: newAddress.label.trim(),
      title: newAddress.label.trim(),
      address: `${newAddress.line1.trim()}, ${newAddress.city.trim()}, ${newAddress.state.trim() || 'N/A'}, ${newAddress.postal.trim()}`,
      details: 'Default delivery address'
    })

    setNewAddress({ label: 'Home', line1: '', city: '', state: '', postal: '' })
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '860px', width: '100%', padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px', background: '#fff' }}>
          <div style={{ padding: '28px', borderRight: '1px solid #eee' }}>
            <h2 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: 700 }}>Select Delivery Location</h2>
            <div style={{ marginBottom: '20px', padding: '18px', borderRadius: '14px', border: '1px solid #e5e5e5', background: '#f9faf7' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                {selectedAddress ? `${selectedAddress.label} address selected` : 'No address selected'}
              </div>
              <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.6' }}>
                {selectedAddress ? selectedAddress.address : 'Select a saved address or add a new address to continue.'}
              </div>
              {selectedAddress?.details && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#777' }}>
                  {selectedAddress.details}
                </div>
              )}
            </div>

            <p style={{ marginBottom: '24px', color: '#666', lineHeight: '1.6' }}>
              Choose a saved address, add a new location, or use your current location before placing your order.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => onSelectAddress(address.id)}
                    style={{
                      textAlign: 'left',
                      padding: '14px',
                      borderRadius: '12px',
                      border: address.id === selectedAddressId ? '2px solid rgb(94, 148, 0)' : '1px solid #ddd',
                      background: address.id === selectedAddressId ? 'rgba(94, 148, 0, 0.08)' : '#fafafa',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{address.title}</div>
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{address.address}</div>
                    {address.details && <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>{address.details}</div>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px', padding: '18px', borderRadius: '12px', background: '#f8f9f4', border: '1px solid #e7edda' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>Add a new address</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <input name="label" value={newAddress.label} onChange={handleInputChange} placeholder="Label (Home / Office)" style={inputStyle} />
                <input name="line1" value={newAddress.line1} onChange={handleInputChange} placeholder="Address line" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" style={inputStyle} />
                  <input name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" style={inputStyle} />
                </div>
                <input name="postal" value={newAddress.postal} onChange={handleInputChange} placeholder="PIN / ZIP code" style={inputStyle} />
                <button type="button" onClick={handleAddNewAddress} style={secondaryButtonStyle}>Save address</button>
              </div>
            </div>

            <button type="button" onClick={onUseCurrentLocation} style={{ ...secondaryButtonStyle, width: '100%', justifyContent: 'center' }}>
              Use current location
            </button>
          </div>

          <div style={{ padding: '28px' }}>
            <h2 style={{ marginBottom: '12px', fontSize: '22px', fontWeight: 700 }}>Choose Delivery Slot</h2>
            <p style={{ marginBottom: '24px', color: '#666', lineHeight: '1.6' }}>
              Select a delivery slot that works for you. We will finalize your order once this is confirmed.
            </p>

            <div style={{ display: 'grid', gap: '14px', marginBottom: '28px' }}>
              {deliverySlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => onSelectSlot(slot)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedSlot === slot ? '2px solid rgb(94, 148, 0)' : '1px solid #ddd',
                    background: selectedSlot === slot ? 'rgba(94, 148, 0, 0.08)' : '#fafafa',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{slot}</div>
                  <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Estimated delivery window and charges will update on confirm.</div>
                </button>
              ))}
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #eee', background: '#f5f5f5', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', marginBottom: '8px', color: '#333', fontWeight: 700 }}>Ready to place your order</div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                Selected address: {selectedAddress ? selectedAddress.title : 'None'}
                <br />
                Selected slot: {selectedSlot || 'None'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!selectedAddress || !selectedSlot || checkoutLoading}
                style={{
                  padding: '14px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgb(204, 0, 0)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: selectedAddress && selectedSlot && !checkoutLoading ? 'pointer' : 'not-allowed',
                  opacity: selectedAddress && selectedSlot && !checkoutLoading ? 1 : 0.6,
                  flex: '1 1 200px'
                }}
              >
                {checkoutLoading ? 'Placing order...' : 'Confirm delivery & pay'}
              </button>

              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '14px 22px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: '#333',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flex: '1 1 120px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
}

const secondaryButtonStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '10px',
  border: '1px solid rgb(94, 148, 0)',
  background: 'transparent',
  color: 'rgb(94, 148, 0)',
  fontWeight: 700,
  cursor: 'pointer'
}
