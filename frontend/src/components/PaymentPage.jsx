import React, { useState } from 'react'
import { CheckoutHeader } from './CheckoutPage'

const GREEN = 'rgb(94,148,0)'
const RED = 'rgb(204,0,0)'
const DARK = 'rgb(32,32,32)'

const BANKS = ['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra','Punjab National Bank','Bank of Baroda','Canara Bank','Union Bank','Yes Bank']
const WALLETS = [
  { name: 'PhonePe', color: '#5f259f', emoji: '📱' },
  { name: 'Google Pay', color: '#4285f4', emoji: '🅖' },
  { name: 'Paytm', color: '#00b9f1', emoji: '💰' },
  { name: 'Amazon Pay', color: '#ff9900', emoji: '🛒' },
]

export default function PaymentPage({ address, slot, cart, onBack, onCompletePayment, checkoutLoading }) {
  const [tab, setTab] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('')

  const subtotal = cart.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)
  const deliveryCharge = subtotal >= 99 ? 0 : 25
  const handlingCharge = 6
  const total = subtotal + deliveryCharge + handlingCharge
  const savings = cart.reduce((s, i) => s + ((i.product?.mrp || i.product?.price || 0) - (i.product?.price || 0)) * i.quantity, 0)

  const tabs = [
    { id: 'upi', label: 'UPI', icon: '⚡' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
    { id: 'wallet', label: 'Wallets', icon: '👝' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  ]

  const tabStyle = (id) => ({
    padding: '12px 16px', textAlign: 'left', background: tab === id ? '#f1f8e6' : '#fff',
    border: 'none', borderLeft: tab === id ? `3px solid ${GREEN}` : '3px solid transparent',
    borderBottom: '0.8px solid #eee', cursor: 'pointer', fontWeight: tab === id ? 700 : 400,
    color: tab === id ? GREEN : DARK, fontSize: '14px', width: '100%', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: '10px'
  })

  const inp = { width: '100%', padding: '10px 14px', borderRadius: '4px', border: '0.8px solid #d5d5d5', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f0', fontFamily: 'ProximaNova,Helvetica,Arial,sans-serif' }}>
      <CheckoutHeader step={3} selectedAddress={address} selectedSlot={slot} onChangeAddress={onBack} onChangeSlot={onBack} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 40px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

        {/* LEFT — Payment UI */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '0.8px solid #eee', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '0.8px solid #eee' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: DARK }}>Payment Options</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
            {/* Tab sidebar */}
            <div style={{ borderRight: '0.8px solid #eee' }}>
              {tabs.map(t => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)} style={tabStyle(t.id)}>
                  <span style={{ fontSize: '18px' }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: '24px', minHeight: '380px' }}>

              {tab === 'upi' && (
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: DARK }}>Pay via UPI ID</h3>
                  <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>Enter your UPI ID and click Verify to proceed</p>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ ...inp, flex: 1 }} />
                    <button type="button" style={{ padding: '10px 20px', background: '#fff', border: `0.8px solid ${GREEN}`, borderRadius: '4px', color: GREEN, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Verify</button>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#888', fontWeight: 600 }}>Or pay with UPI apps</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {WALLETS.map(w => (
                      <button key={w.name} type="button" onClick={() => setSelectedWallet(w.name)} style={{ padding: '12px 8px', borderRadius: '8px', border: selectedWallet === w.name ? `2px solid ${GREEN}` : '0.8px solid #ddd', background: selectedWallet === w.name ? '#f1f8e6' : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '28px' }}>{w.emoji}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: DARK }}>{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'card' && (
                <div>
                  <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: DARK }}>Add Card Details</h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px', display: 'block' }}>Card Number</label>
                      <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())} placeholder="0000 0000 0000 0000" style={inp} maxLength={19} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px', display: 'block' }}>Name on Card</label>
                      <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Full name as on card" style={inp} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px', display: 'block' }}>Expiry (MM/YY)</label>
                        <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" style={inp} maxLength={5} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px', display: 'block' }}>CVV</label>
                        <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/,'').slice(0,3))} placeholder="•••" style={inp} type="password" maxLength={3} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>Your card details are secured with 256-bit SSL encryption</span>
                  </div>
                </div>
              )}

              {tab === 'netbanking' && (
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: DARK }}>Select your Bank</h3>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>You will be redirected to your bank's website to complete the payment</p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {BANKS.map(bank => (
                      <button key={bank} type="button" onClick={() => setSelectedBank(bank)} style={{ padding: '12px 16px', borderRadius: '6px', border: selectedBank === bank ? `1.5px solid ${GREEN}` : '0.8px solid #ddd', background: selectedBank === bank ? '#f1f8e6' : '#fafafa', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: selectedBank === bank ? 700 : 400, color: DARK, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedBank === bank ? GREEN : '#ccc', display: 'inline-block', flexShrink: 0 }} />
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'wallet' && (
                <div>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: DARK }}>Select Wallet</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {WALLETS.map(w => (
                      <button key={w.name} type="button" onClick={() => setSelectedWallet(w.name)} style={{ padding: '16px', borderRadius: '8px', border: selectedWallet === w.name ? `2px solid ${GREEN}` : '0.8px solid #ddd', background: selectedWallet === w.name ? '#f1f8e6' : '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'inherit' }}>
                        <span style={{ fontSize: '28px' }}>{w.emoji}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: DARK }}>{w.name}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>Balance: ₹0</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'cod' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '16px' }}>
                  <span style={{ fontSize: '56px' }}>💵</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: DARK }}>Cash on Delivery</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>Pay in cash when your order arrives. Please keep exact change ready. A ₹25 COD handling fee may apply.</p>
                  <div style={{ padding: '12px 20px', background: '#fffae6', border: '0.8px solid #ffcc00', borderRadius: '6px', fontSize: '13px', color: '#555' }}>
                    COD available for orders under ₹5,000
                  </div>
                </div>
              )}

              {/* Pay button */}
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'row-reverse', gap: '12px' }}>
                <button type="button" onClick={onCompletePayment} disabled={checkoutLoading} style={{ height: '40px', width: '13.5rem', background: checkoutLoading ? '#ccc' : RED, color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '16px', cursor: checkoutLoading ? 'not-allowed' : 'pointer', letterSpacing: '0.25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
                  {checkoutLoading ? 'Placing order…' : `Pay ₹${total.toFixed(2)}`}
                </button>
                <button type="button" onClick={onBack} style={{ height: '40px', padding: '0 20px', background: '#fff', border: '0.8px solid #ccc', borderRadius: '4px', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', position: 'sticky', top: '100px' }}>
          <div style={{ height: '6px', background: GREEN, borderRadius: '9999px 9999px 0 0' }} />
          <div style={{ padding: '8px' }}>

            {/* Voucher */}
            <div style={{ padding: '10px', border: '0.8px solid #eee', borderRadius: '4px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'linear-gradient(135deg,#ADD566,#76B900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>%</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: DARK }}>Apply Voucher</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#606060' }}>0 vouchers available</div>
              </div>
              <button style={{ color: 'rgb(214,51,51)', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>

            <span style={{ fontSize: '18px', fontWeight: 700, color: DARK, display: 'inline-block', paddingTop: '6px', paddingBottom: '10px', borderBottom: '0.8px solid #eee', width: '100%', marginBottom: '4px' }}>Order Summary</span>

            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'grid', gap: '10px', padding: '4px', marginBottom: '12px' }}>
              {cart.map(item => (
                <div key={item.product_id || item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <img src={item.product?.image_url} alt={item.product?.name} style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '4px', background: '#f7f7f7', border: '0.8px solid #d5d5d5', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{item.quantity} × ₹{item.product?.price?.toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#f7f7f7', borderRadius: '4px', padding: '8px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: '#555' }}><span>Basket Value</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: '#555' }}><span>Delivery Charge</span><span style={{ color: deliveryCharge === 0 ? GREEN : '#555', fontWeight: deliveryCharge === 0 ? 600 : 400 }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}><span>Handling Charge</span><span>₹{handlingCharge}</span></div>
            </div>

            <div style={{ padding: '10px 8px', display: 'flex', justifyContent: 'space-between', borderTop: '0.8px solid #eee' }}>
              <span style={{ fontSize: '16px', color: DARK, fontWeight: 600 }}>Total Amount Payable</span>
              <span style={{ fontSize: '16px', color: DARK, fontWeight: 600 }}>₹{total.toFixed(2)}</span>
            </div>

            {savings > 0 && (
              <div style={{ background: '#f1f8e6', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: GREEN }}>Total Savings</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: GREEN }}>₹{savings.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
