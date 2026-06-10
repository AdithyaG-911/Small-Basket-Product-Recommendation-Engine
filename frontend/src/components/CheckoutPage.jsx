import React, { useMemo, useState } from 'react'
import logoImage from '../../logo.png'

const GREEN = 'rgb(94,148,0)'
const RED = 'rgb(204,0,0)'
const DARK = 'rgb(32,32,32)'

const Logo = ({ onClick, headerBg }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Go to SmallBasket home"
    style={{ display: 'flex', alignItems: 'center', flexShrink: 0, border: 'none', background: 'transparent', padding: '8px 12px', cursor: onClick ? 'pointer' : 'default' }}
  >
    <img src={logoImage} alt="SmallBasket" style={{ height: 36, width: 'auto', display: 'block' }} />
  </button>
)

const CheckIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '2rem', height: '32px', display: 'block', flexShrink: 0 }}>
    <rect width="28" height="28" rx="14" fill="#76B900" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12.22 19a.834.834 0 0 1-.608-.262L7.56 14.422a.833.833 0 1 1 1.214-1.141l3.437 3.659 7.007-7.668a.834.834 0 0 1 1.23 1.123l-7.613 8.333a.832.832 0 0 1-.61.272h-.005Z" fill="#fff" />
  </svg>
)

const LocationIcon = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '2rem', height: '32px', display: 'block', flexShrink: 0 }}>
    <rect width="28" height="28" rx="14" fill={active ? '#fff' : '#2F4A00'} />
    <path fillRule="evenodd" clipRule="evenodd" d="M14 13.166c-.689 0-1.25-.56-1.25-1.25 0-.689.561-1.25 1.25-1.25.69 0 1.25.561 1.25 1.25 0 .69-.56 1.25-1.25 1.25ZM14 9a2.92 2.92 0 0 0-2.916 2.916A2.92 2.92 0 0 0 14 14.833a2.92 2.92 0 0 0 2.917-2.917A2.92 2.92 0 0 0 14 9Zm0 11.372c-1.396-1.32-5-5.026-5-8.104 0-2.72 2.243-4.935 5-4.935 2.758 0 5 2.214 5 4.935 0 3.078-3.604 6.784-5 8.104Zm0-14.705c-3.676 0-6.667 2.96-6.667 6.601 0 4.563 5.875 9.65 6.125 9.864a.832.832 0 0 0 1.085 0c.25-.215 6.124-5.301 6.124-9.864 0-3.64-2.991-6.601-6.667-6.601Z" fill={active ? '#202020' : '#fff'} />
  </svg>
)

const TruckIcon = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '2rem', height: '32px', display: 'block', flexShrink: 0, opacity: active ? 1 : 0.75 }}>
    <rect width="28" height="28" rx="14" fill={active ? '#fff' : '#2F4A00'} />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.804 14.217h2.283l-.132.791a2.286 2.286 0 0 0-1.498 2.144 2.285 2.285 0 0 0 2.282 2.283c.909 0 1.695-.534 2.062-1.305h4.354a2.285 2.285 0 0 0 2.062 1.305 2.285 2.285 0 0 0 2.283-2.283c0-.967-.604-1.795-1.455-2.127l-.346-1.258.497.124v-1.956l-.938.234-.154-.56v-1.305h-2.17v1.305h.864c0 .118.017.236.05.352l.21.762-1.993 1.494h-1.087c0-.719-.585-1.304-1.304-1.304h-.49L13.675 9H6.5l1.63.978-.04.53h-.938l.877.795-.02.265-.042.53-.163 2.12Z" fill={active ? '#202020' : '#fff'} />
  </svg>
)

const CardIcon = ({ active }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '2rem', height: '32px', display: 'block', flexShrink: 0, opacity: active ? 1 : 0.75 }}>
    <rect width="28" height="28" rx="14" fill={active ? '#fff' : '#2F4A00'} />
    <path fillRule="evenodd" clipRule="evenodd" d="M13.166 16.5H9.833A.836.836 0 0 1 9 15.667c0-.459.375-.834.833-.834h3.333c.459 0 .834.375.834.834a.836.836 0 0 1-.834.833Zm5 0H16.5a.836.836 0 0 1-.834-.833c0-.459.375-.834.834-.834h1.666c.459 0 .834.375.834.834a.836.836 0 0 1-.834.833Zm2.5.833c0 .46-.373.834-.833.834H8.167a.834.834 0 0 1-.834-.834v-4.166h13.334v4.166ZM7.333 10.667c0-.46.373-.834.833-.834h11.667c.46 0 .834.374.834.834v.833H7.332v-.833Zm12.5-2.5H8.167a2.503 2.503 0 0 0-2.5 2.5v6.666c0 1.379 1.121 2.5 2.5 2.5h11.666c1.379 0 2.5-1.121 2.5-2.5v-6.666c0-1.379-1.121-2.5-2.5-2.5Z" fill={active ? '#202020' : '#fff'} />
  </svg>
)

export function CheckoutHeader({ step, selectedAddress, selectedSlot, onChangeAddress, onChangeSlot, onHomeClick }) {
  const connectorSolid = { flex: 1, borderBottom: '0.8px solid rgba(255,255,255,0.6)', marginLeft: '4px', marginRight: '-10px' }
  const connectorDashed = { flex: 1, borderBottom: '0.8px dashed rgba(255,255,255,0.4)', marginLeft: '4px', marginRight: '-10px' }

  const ChangeBtn = ({ onClick }) => (
    <button type="button" onClick={onClick} style={{ color: '#fff', fontSize: '12px', padding: '4px 6px', border: '0.8px solid #fff', borderRadius: '4px', background: 'transparent', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
      Change
    </button>
  )

  return (
    <header style={{ background: 'linear-gradient(135deg,#2F4A00 0%,#4a7300 60%,#3d6200 100%)', boxShadow: '0 2px 12px rgba(0,0,0,.18)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '10px 156px', display: 'flex', alignItems: 'center' }}>
        <Logo onClick={onHomeClick} />
        <div style={{ display: 'grid', gridAutoColumns: 'calc(33.3333% - 16px)', gridAutoFlow: 'column', gap: '24px', paddingLeft: '44px', flex: 1, color: '#fff' }}>
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {step > 1 ? <CheckIcon /> : <LocationIcon active={step === 1} />}
                <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: '25.2px', opacity: step >= 1 ? 1 : 0.75, flex: '0 0 auto' }}>Delivery Address</div>
              </div>
              <div style={step > 1 ? connectorSolid : connectorDashed} />
            </div>
            <div style={{ opacity: step >= 1 ? 1 : 0.75, display: 'flex', alignItems: 'center', gap: '10px' }}>
              {step > 1 && selectedAddress ? (
                <>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '18.62px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{selectedAddress.label} - </span>
                    {selectedAddress.address}
                  </p>
                  {onChangeAddress && <ChangeBtn onClick={onChangeAddress} />}
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '18.62px' }}>
                  {selectedAddress
                    ? <><span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{selectedAddress.label} - </span>{selectedAddress.address}</>
                    : '- Select your delivery address from the list or add new address'}
                </p>
              )}
            </div>
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {step > 2 ? <CheckIcon /> : <TruckIcon active={step === 2} />}
                <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: '25.2px', opacity: step >= 2 ? 1 : 0.75, flex: '0 0 auto' }}>Delivery Options</div>
              </div>
              <div style={step > 2 ? connectorSolid : connectorDashed} />
            </div>
            <div style={{ opacity: step >= 2 ? 1 : 0.75, display: 'flex', alignItems: 'center', gap: '10px' }}>
              {step > 2 && selectedSlot ? (
                <>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '18.62px' }}>{selectedSlot}</p>
                  {onChangeSlot && <ChangeBtn onClick={onChangeSlot} />}
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '18.62px' }}>Choose your convenient date and time for delivery</p>
              )}
            </div>
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CardIcon active={step === 3} />
              <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: '25.2px', opacity: step >= 3 ? 1 : 0.75 }}>Payment Options</div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '18.62px', opacity: step >= 3 ? 1 : 0.75 }}>Pay order amount by selecting any payment mode</p>
          </div>
        </div>
      </div>
    </header>
  )
}

const emptyAddressForm = { label: 'Home', line1: '', city: '', state: '', postal: '' }

const splitAddress = (addressText = '') => {
  const parts = String(addressText).split(',').map((part) => part.trim()).filter(Boolean)
  return {
    line1: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    postal: parts.slice(3).join(', ') || ''
  }
}

const coordsText = (address) => {
  const lat = Number(address?.lat ?? address?.coords?.lat)
  const lon = Number(address?.lon ?? address?.coords?.lon)
  return Number.isFinite(lat) && Number.isFinite(lon) ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : ''
}

export default function CheckoutPage({ addresses, selectedAddressId, selectedSlot, onSelectAddress, onSelectSlot, onUseCurrentLocation, onAddAddress, onRemoveAddress, onCancel, onConfirm, onHomeClick, checkoutLoading, cart }) {
  const [newAddress, setNewAddress] = useState(emptyAddressForm)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)

  const selectedAddress = useMemo(() => addresses.find((address) => address.id === selectedAddressId), [addresses, selectedAddressId])
  const slots = [
    { label: 'Today, 12 - 2 PM', detail: 'Express delivery' },
    { label: 'Today, 3 - 5 PM', detail: 'Afternoon slot' },
    { label: 'Tomorrow, 9 - 11 AM', detail: 'Morning delivery' },
    { label: 'Tomorrow, 4 - 6 PM', detail: 'Evening slot' }
  ]

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const savings = cart.reduce((sum, item) => sum + ((item.product?.mrp || item.product?.price || 0) - (item.product?.price || 0)) * item.quantity, 0)

  const cancelAddressForm = () => {
    setNewAddress(emptyAddressForm)
    setEditingAddressId(null)
    setShowAddForm(false)
  }

  const handleSaveAddress = () => {
    if (!newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.postal.trim()) return

    const existing = addresses.find((address) => address.id === editingAddressId)
    onAddAddress({
      ...(existing || {}),
      id: editingAddressId || `addr-${Date.now()}`,
      label: newAddress.label.trim() || 'Home',
      title: newAddress.label.trim() || 'Home',
      address: `${newAddress.line1.trim()}, ${newAddress.city.trim()}, ${newAddress.state.trim()}, ${newAddress.postal.trim()}`,
      details: editingAddressId ? 'Updated delivery address' : 'Custom address'
    })
    cancelAddressForm()
  }

  const startEditAddress = (address) => {
    const parsed = splitAddress(address.address)
    setEditingAddressId(address.id)
    setNewAddress({
      label: address.label || address.title || 'Home',
      line1: parsed.line1,
      city: parsed.city,
      state: parsed.state,
      postal: parsed.postal
    })
    setShowAddForm(true)
    setConfirmRemoveId(null)
  }

  const handleRemoveAddress = (addressId) => {
    if (confirmRemoveId !== addressId) {
      setConfirmRemoveId(addressId)
      return
    }
    onRemoveAddress && onRemoveAddress(addressId)
    if (editingAddressId === addressId) cancelAddressForm()
    setConfirmRemoveId(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f0', fontFamily: 'ProximaNova,Helvetica,Arial,sans-serif' }}>
      <CheckoutHeader step={1} selectedAddress={selectedAddress} selectedSlot={selectedSlot} onHomeClick={onHomeClick} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 40px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: DARK }}>Checkout</h1>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#666' }}>Confirm your address and delivery slot before payment.</p>
            </div>
            <button type="button" onClick={onCancel} style={{ ...ghostBtn, background: '#fff' }}>Back to basket</button>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', border: '0.8px solid #eee', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: DARK }}>Delivery address</h2>
              <button type="button" onClick={() => showAddForm ? cancelAddressForm() : setShowAddForm(true)} style={{ fontSize: '13px', color: GREEN, fontWeight: 600, background: 'none', border: `1px solid ${GREEN}`, borderRadius: '4px', padding: '4px 12px', cursor: 'pointer' }}>
                {showAddForm ? 'Close form' : '+ Add new'}
              </button>
            </div>

            {showAddForm && (
              <div style={{ padding: '16px 24px', background: '#f8faf4', borderBottom: '1px solid #eee' }}>
                <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 700, color: DARK }}>{editingAddressId ? 'Edit selected address' : 'Add a new address'}</div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[['label', 'Label (Home / Office)'], ['line1', 'Address line'], ['city', 'City'], ['state', 'State'], ['postal', 'PIN / ZIP']].map(([name, placeholder]) => (
                    <input key={name} value={newAddress[name]} onChange={(event) => setNewAddress((prev) => ({ ...prev, [name]: event.target.value }))} placeholder={placeholder} style={inp} />
                  ))}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={handleSaveAddress} style={primaryBtn}>{editingAddressId ? 'Update address' : 'Save address'}</button>
                    <button type="button" onClick={cancelAddressForm} style={ghostBtn}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ padding: '16px 24px', display: 'grid', gap: '12px' }}>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId
                const pin = coordsText(address)

                return (
                  <div key={address.id} style={{ padding: '16px', borderRadius: '10px', border: isSelected ? `2px solid ${GREEN}` : '1px solid #ddd', background: isSelected ? 'rgba(94,148,0,.06)' : '#fafafa', transition: 'all .18s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: isSelected ? GREEN : '#eee', color: isSelected ? '#fff' : '#555', textTransform: 'uppercase' }}>{address.label || 'Address'}</span>
                        {isSelected && <span style={{ marginLeft: '8px', color: GREEN, fontSize: '12px', fontWeight: 700 }}>Selected</span>}
                        <div style={{ fontSize: '14px', fontWeight: 700, color: DARK, marginTop: '8px', marginBottom: '4px' }}>{address.title}</div>
                        <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{address.address}</div>
                        {address.details && <div style={{ marginTop: '6px', fontSize: '12px', color: '#777', lineHeight: 1.45 }}>{address.details}</div>}
                        {pin && <div style={{ marginTop: '6px', fontSize: '12px', color: '#999' }}>Pin: {pin}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => onSelectAddress(address.id)} style={{ ...smallActionBtn, background: isSelected ? GREEN : '#fff', color: isSelected ? '#fff' : GREEN, borderColor: GREEN }}>
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                        <button type="button" onClick={() => startEditAddress(address)} style={smallActionBtn}>Edit</button>
                        <button type="button" onClick={() => handleRemoveAddress(address.id)} style={{ ...smallActionBtn, borderColor: RED, color: RED }}>
                          {confirmRemoveId === address.id ? 'Confirm remove' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              <button type="button" onClick={onUseCurrentLocation} style={{ padding: '14px', borderRadius: '10px', border: `1px dashed ${GREEN}`, background: 'rgba(94,148,0,.04)', color: GREEN, fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Use current location
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', border: '0.8px solid #eee', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: DARK }}>Select a delivery option</span>
            </div>
            <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {slots.map((slot) => (
                <button key={slot.label} type="button" onClick={() => onSelectSlot(slot.label)} style={{ padding: '16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', border: selectedSlot === slot.label ? `2px solid ${GREEN}` : '1px solid #ddd', background: selectedSlot === slot.label ? 'rgba(94,148,0,.06)' : '#fafafa', transition: 'all .18s' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: DARK, marginBottom: '4px' }}>{slot.label}</div>
                  <div style={{ fontSize: '12px', color: '#777' }}>{slot.detail}</div>
                  {selectedSlot === slot.label && <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: GREEN }}>Selected</div>}
                </button>
              ))}
            </div>
            <div style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onConfirm} disabled={!selectedAddress || !selectedSlot || checkoutLoading} style={{ height: '40px', width: '13.5rem', background: selectedAddress && selectedSlot && !checkoutLoading ? RED : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '16px', cursor: selectedAddress && selectedSlot && !checkoutLoading ? 'pointer' : 'not-allowed', letterSpacing: '0.25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {checkoutLoading ? 'Processing...' : 'Proceed to payment'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', position: 'sticky', top: '100px' }}>
          <div style={{ height: '6px', background: GREEN, borderRadius: '9999px 9999px 0 0' }} />
          <div style={{ padding: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: DARK, display: 'inline-block', paddingTop: '6px', paddingBottom: '10px', borderBottom: '0.8px solid #eee', width: '100%', marginBottom: '4px' }}>Order Summary</span>
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'grid', gap: '10px', marginBottom: '12px', padding: '4px' }}>
              {cart.map((item) => (
                <div key={item.product_id || item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <img src={item.product?.image_url} alt={item.product?.name} style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '4px', background: '#f7f7f7', flexShrink: 0, border: '0.8px solid #d5d5d5' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{item.quantity} x Rs.{item.product?.price?.toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>Rs.{((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 8px', justifyContent: 'space-between', display: 'flex', borderTop: '0.8px solid #eee' }}>
              <span style={{ fontSize: '16px', color: DARK, fontWeight: 600 }}>Total Amount Payable</span>
              <span style={{ fontSize: '16px', color: DARK, fontWeight: 600 }}>Rs.{subtotal.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div style={{ background: '#f1f8e6', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: GREEN }}>Total Savings</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: GREEN }}>Rs.{savings.toFixed(2)}</span>
              </div>
            )}
            <div style={{ border: '0.8px solid #ffcc00', padding: '8px', background: '#fffae6', borderRadius: '4px', display: 'grid', gridAutoFlow: 'column', gap: '4px', marginTop: '10px' }}>
              <span style={{ color: DARK, fontSize: '12px', lineHeight: '20px' }}>Select your address and delivery slot to know accurate delivery charges. You can save more by applying a voucher.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const inp = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
const primaryBtn = { padding: '10px 16px', borderRadius: '8px', border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }
const ghostBtn = { padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', color: '#555', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }
const smallActionBtn = { padding: '8px 10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#333', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }
