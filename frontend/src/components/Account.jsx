import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function Account({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate()
  const [editingField, setEditingField] = useState(null) // 'full_name', 'phone', 'email'
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
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
      setEditingField(null)
    }
  }

  const handleCancel = (field) => {
    setFormData(prev => ({ ...prev, [field]: user[field] || '' }))
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
            <div style={{ marginLeft: '3px', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '14px' }}>{user[field] || `Enter ${label}`}</div>
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

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 10fr', gap: '40px', marginTop: '30px' }}>
        
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Section 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <div style={{ fontWeight: 600, borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '1.6px', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
              <div style={{ color: 'rgb(80, 80, 80)', fontSize: '14px', paddingTop: '16px', paddingBottom: '10px', borderColor: 'rgb(118, 185, 0)', borderBottomWidth: '1.6px', display: 'inline-block', boxSizing: 'content-box', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
                <span style={{ fontWeight: 600 }}>PERSONAL DETAILS</span>
              </div>
            </div>
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account') }} style={{ color: 'rgb(32, 32, 32)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Edit Profile</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/addresses') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Delivery Addresses</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/email-settings') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Email Addresses</a>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <div style={{ fontWeight: 600, borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '1.6px', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
              <div style={{ color: 'rgb(80, 80, 80)', fontSize: '14px', paddingTop: '16px', paddingBottom: '10px', borderColor: 'rgb(118, 185, 0)', borderBottomWidth: '1.6px', display: 'inline-block', boxSizing: 'content-box', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
                <span style={{ fontWeight: 600 }}>SHOP FROM</span>
              </div>
            </div>
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/smart-basket') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Smart Basket</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/orders') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Past Orders</a>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <div style={{ fontWeight: 600, borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '1.6px', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
              <div style={{ color: 'rgb(80, 80, 80)', fontSize: '14px', paddingTop: '16px', paddingBottom: '10px', borderColor: 'rgb(118, 185, 0)', borderBottomWidth: '1.6px', display: 'inline-block', boxSizing: 'content-box', borderWidth: '0px 0px 1.6px', borderStyle: 'solid' }}>
                <span style={{ fontWeight: 600 }}>MY ACCOUNT</span>
              </div>
            </div>
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/orders') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>My Orders</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/wallet') }} style={{ color: 'rgb(144, 144, 144)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>My Wallet</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onLogout && onLogout() }} style={{ color: 'rgb(204, 0, 0)', marginBottom: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Logout</a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'rgb(255, 255, 255)', padding: '20px', width: '100%' }}>
            
            {renderField('Name', 'full_name')}
            {renderField('Mobile Number', 'phone', 'tel')}
            {renderField('Email', 'email', 'email')}

            {/* Newsletter Checkbox */}
            <label style={{ color: 'rgb(102, 102, 102)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '16px', height: '16px', marginRight: '10px', accentColor: 'rgb(118, 185, 0)' }} />
              <span style={{ fontSize: '14px' }}>Send me mails on promotions, offers and services</span>
            </label>

          </div>
        </div>
      </div>
    </div>
  )
}

const EditSVG = () => (
  <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.34415 6.22878L7.77207 4.6567L8.9084 3.51978L10.4799 5.09128L9.34415 6.22878ZM5.2964 10.2806L3.55982 10.4387L3.71382 8.71436L6.9904 5.43778L8.56307 7.01045L5.2964 10.2806ZM11.3187 4.27986L11.3182 4.27928L9.72099 2.68211C9.28874 2.25103 8.54615 2.23061 8.13665 2.64186L2.88899 7.88953C2.69882 8.07911 2.58099 8.33111 2.55649 8.5977L2.3354 11.0302C2.32024 11.2023 2.38149 11.3726 2.50399 11.4951C2.61424 11.6054 2.76299 11.666 2.9164 11.666C2.93449 11.666 2.95199 11.6654 2.96949 11.6637L5.40199 11.4426C5.66915 11.4181 5.92057 11.3009 6.11015 11.1113L11.3584 5.86303C11.7831 5.4372 11.765 4.7267 11.3187 4.27986Z" fill="#606060" />
  </svg>
)
