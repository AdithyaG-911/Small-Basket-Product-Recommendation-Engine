import React from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function MyOrders({ orders = [] }) {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[
        { label: 'My Account', path: '/account' },
        { label: 'My Orders' }
      ]} />

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>My Orders</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Track your current orders and view your order history.</p>
      </div>

      {orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#999', display: 'block' }}>ORDER PLACED</span>
                  <span style={{ fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#999', display: 'block' }}>TOTAL</span>
                  <span style={{ fontWeight: 600 }}>₹{order.total_price.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#999', display: 'block' }}>ORDER #</span>
                  <span style={{ fontWeight: 600 }}>SB-{order.id.toString().padStart(6, '0')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                    backgroundColor: order.status === 'Delivered' ? 'rgb(228, 241, 204)' : '#fff3cd',
                    color: order.status === 'Delivered' ? 'rgb(94, 148, 0)' : '#856404'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', background: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.product?.image_url || 'https://via.placeholder.com/50'} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', display: 'block' }}>{item.product?.name}</span>
                      <span style={{ fontSize: '12px', color: '#666' }}>Quantity: {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button 
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{ background: 'none', border: '1px solid #ddd', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                >
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>You haven't placed any orders yet</h3>
          <p style={{ color: '#999' }}>Looks like you haven't bought anything yet. Explore our fresh products and start shopping!</p>
          <button 
            onClick={() => navigate('/')}
            style={{ marginTop: '20px', padding: '12px 24px', background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
          >
            START SHOPPING
          </button>
        </div>
      )}
    </div>
  )
}
