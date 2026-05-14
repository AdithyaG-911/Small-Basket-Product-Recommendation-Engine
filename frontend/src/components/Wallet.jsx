import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Wallet({ balance = 0, onAddMoney }) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')

  const handleAdd = () => {
    if (!amount || isNaN(amount)) return
    onAddMoney && onAddMoney(parseFloat(amount))
    setAmount('')
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'My Wallet' }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Balance Card */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>SmallBasket Wallet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Your available balance for quick checkouts</p>
          
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'rgb(118, 185, 0)', marginBottom: '10px' }}>
            ₹{balance.toFixed(2)}
          </div>
          <p style={{ fontSize: '14px', color: '#999' }}>Secure & Instant</p>
        </div>

        {/* Add Money Form */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Add Money to Wallet</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>Enter Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            {[100, 500, 1000, 2000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgb(118, 185, 0)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}
              >
                +₹{val}
              </button>
            ))}
          </div>
          <button 
            onClick={handleAdd}
            style={{ width: '100%', padding: '14px', borderRadius: '6px', border: 'none', background: 'rgb(118, 185, 0)', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
          >
            PROCEED TO ADD MONEY
          </button>
        </div>
      </div>
    </div>
  )
}
