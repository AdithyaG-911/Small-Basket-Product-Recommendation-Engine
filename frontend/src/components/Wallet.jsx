import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Wallet({ balance = 0, onAddMoney }) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('walletTransactions') || '[]')
    } catch (err) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('walletTransactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (amount) => {
    const next = [
      {
        id: Date.now(),
        type: 'Credit',
        amount: Number(amount),
        status: 'Completed',
        date: new Date().toLocaleString(),
        description: 'Wallet top-up'
      },
      ...transactions
    ].slice(0, 10)
    setTransactions(next)
  }

  const handleAdd = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return
    const value = parseFloat(amount)
    onAddMoney && onAddMoney(value)
    addTransaction(value)
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
          <p style={{ margin: '0 0 24px', color: '#666', lineHeight: 1.7 }}>Your wallet balance can be used directly in checkout, so you never need to re-enter payment details.</p>
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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {[100, 500, 1000, 2000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
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

          {transactions.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ margin: '0 0 14px', fontSize: '18px', color: '#333' }}>Recent transactions</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {transactions.map((transaction) => (
                  <div key={transaction.id} style={{ padding: '14px 16px', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#222' }}>{transaction.description}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{transaction.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(118, 185, 0)' }}>+₹{transaction.amount.toFixed(2)}</div>
                      <div style={{ fontSize: '12px', color: '#777' }}>{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
