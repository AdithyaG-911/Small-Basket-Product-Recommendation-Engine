import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Account({ user, onLogout, onUpdateUser, walletBalance = 0, ordersCount = 0, addressCount = 0, savedCount = 0 }) {
  const navigate = useNavigate()
  const [editingField, setEditingField] = useState(null) // 'full_name', 'phone', 'email'
  const [localUser, setLocalUser] = useState(user)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setLocalUser(user)
      setFormData({
        full_name: user.full_name || user.username || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
  }, [user])

  if (!user) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Please login to view your account</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Go Home</button>
      </div>
    )
  }

  const handleSave = async (field) => {
    const update = { [field]: formData[field] }
    const success = await onUpdateUser(update)
    if (success) {
      setLocalUser(prev => ({ ...prev, ...update }))
      setFormData(prev => ({ ...prev, ...update }))
      setEditingField(null)
    }
  }

  const handleCancel = (field) => {
    setFormData(prev => ({ ...prev, [field]: localUser?.[field] || user?.[field] || '' }))
    setEditingField(null)
  }

  const renderField = (label, field, type = 'text') => {
    const isEditing = editingField === field
    return (
      <div style={{ padding: '13px 10px', border: '0.8px solid rgb(208, 208, 208)', borderRadius: '3px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ color: 'rgb(153, 153, 153)', fontSize: '12px', whiteSpace: 'nowrap', width: '100px' }}>{label}:</div>
          {isEditing ? (
            <input 
              type={type}
              value={formData[field]}
              onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              style={{ flex: 1, padding: '4px 8px', border: '1px solid rgb(118, 185, 0)', outline: 'none', borderRadius: '4px', fontSize: '14px' }}
              autoFocus
            />
          ) : (
            <div style={{ marginLeft: '3px', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '14px' }}>
              {formData[field] || localUser?.[field] || user[field] || `Enter ${label}`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button onClick={() => handleSave(field)} style={{ cursor: 'pointer', background: 'rgb(118, 185, 0)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Save</button>
              <button onClick={() => handleCancel(field)} style={{ cursor: 'pointer', background: '#eee', color: '#666', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditingField(field)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
              <EditSVG />
            </button>
          )}
        </div>
      </div>
    )
  }

  const displayName = user.full_name || user.username || user.email || 'Customer'

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginTop: '30px' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ececec', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgb(118, 185, 0)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '24px', fontWeight: 700 }}>S</div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Welcome back</p>
                <h1 style={{ margin: '8px 0 0', fontSize: '28px', lineHeight: 1.1 }}>{displayName}</h1>
              </div>
            </div>
            <p style={{ margin: 0, color: '#555', lineHeight: 1.8 }}>This is your account hub. Manage your profile details, wallet, delivery addresses, and order history from one place.</p>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <button onClick={() => navigate('/wallet')} style={{ width: '100%', padding: '16px 18px', borderRadius: '14px', border: '1px solid #e5f1d9', background: '#f6fff0', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#4f6339', fontWeight: 700 }}>Wallet balance</div>
              <div style={{ marginTop: '6px', fontSize: '20px', fontWeight: 800, color: 'rgb(118, 185, 0)' }}>₹{walletBalance.toFixed(2)}</div>
              <div style={{ marginTop: '8px', color: '#777', fontSize: '13px' }}>Add funds once and use them during checkout.</div>
            </button>

            <button onClick={() => navigate('/orders')} style={{ width: '100%', padding: '16px 18px', borderRadius: '14px', border: '1px solid #ececec', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 700 }}>Orders</div>
              <div style={{ marginTop: '6px', fontSize: '20px', fontWeight: 800, color: '#111' }}>{ordersCount}</div>
              <div style={{ marginTop: '8px', color: '#777', fontSize: '13px' }}>Track your recent purchases and order status.</div>
            </button>

            <button onClick={() => navigate('/addresses')} style={{ width: '100%', padding: '16px 18px', borderRadius: '14px', border: '1px solid #ececec', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 700 }}>Saved addresses</div>
              <div style={{ marginTop: '6px', fontSize: '20px', fontWeight: 800, color: '#111' }}>{addressCount}</div>
              <div style={{ marginTop: '8px', color: '#777', fontSize: '13px' }}>Faster checkout with your saved delivery locations.</div>
            </button>

            <button onClick={() => navigate('/cart')} style={{ width: '100%', padding: '16px 18px', borderRadius: '14px', border: '1px solid #ececec', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 700 }}>Saved for later</div>
              <div style={{ marginTop: '6px', fontSize: '20px', fontWeight: 800, color: '#111' }}>{savedCount}</div>
              <div style={{ marginTop: '8px', color: '#777', fontSize: '13px' }}>Items you have saved while deciding later.</div>
            </button>
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ececec', padding: '32px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <h2 style={{ margin: '0 0 14px', fontSize: '24px', color: '#222' }}>Profile settings</h2>
            <p style={{ margin: '0 0 24px', color: '#555', lineHeight: 1.8 }}>Update the details we use to personalize your experience and keep your account information current.</p>
            <div style={{ display: 'grid', gap: '18px' }}>
              {renderField('Name', 'full_name')}
              {renderField('Mobile Number', 'phone', 'tel')}
              {renderField('Email', 'email', 'email')}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #ececec', padding: '30px', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '20px', color: '#222' }}>Account preferences</h3>
            <p style={{ margin: '0 0 18px', color: '#555', lineHeight: 1.8 }}>Control how you hear from us and where we send order updates.</p>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f8f8f8', padding: '16px', borderRadius: '12px', border: '1px solid #ececec', fontSize: '14px', color: '#333' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'rgb(118, 185, 0)' }} />
              Receive promotional emails, offers, and order updates.
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <button onClick={() => navigate('/wallet')} style={{ padding: '18px', borderRadius: '16px', border: '1px solid #ececec', background: '#fff', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '6px' }}>Wallet</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(118, 185, 0)' }}>Use wallet at checkout</div>
            </button>
            <button onClick={() => navigate('/orders')} style={{ padding: '18px', borderRadius: '16px', border: '1px solid #ececec', background: '#fff', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '6px' }}>Order history</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>Track all recent orders</div>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

const EditSVG = () => (
  <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.34415 6.22878L7.77207 4.6567L8.9084 3.51978L10.4799 5.09128L9.34415 6.22878ZM5.2964 10.2806L3.55982 10.4387L3.71382 8.71436L6.9904 5.43778L8.56307 7.01045L5.2964 10.2806ZM11.3187 4.27986L11.3182 4.27928L9.72099 2.68211C9.28874 2.25103 8.54615 2.23061 8.13665 2.64186L2.88899 7.88953C2.69882 8.07911 2.58099 8.33111 2.55649 8.5977L2.3354 11.0302C2.32024 11.2023 2.38149 11.3726 2.50399 11.4951C2.61424 11.6054 2.76299 11.666 2.9164 11.666C2.93449 11.666 2.95199 11.6654 2.96949 11.6637L5.40199 11.4426C5.66915 11.4181 5.92057 11.3009 6.11015 11.1113L11.3584 5.86303C11.7831 5.4372 11.765 4.7267 11.3187 4.27986Z" fill="#606060" />
  </svg>
)
