import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

export default function OrderDetails({ orders = [] }) {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const order = useMemo(() => {
    return orders.find((o) => String(o.id) === String(orderId))
  }, [orders, orderId])

  if (!order) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
        <Breadcrumbs items={[{ label: 'My Orders', path: '/orders' }, { label: 'Order not found' }]} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '14px' }}>Order not found</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>We couldn't find the order you're looking for. Please return to your order history or try again later.</p>
        <button onClick={() => navigate('/orders')} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'rgb(94, 148, 0)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Back to Orders</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      <Breadcrumbs items={[{ label: 'My Orders', path: '/orders' }, { label: `Order #${String(order.id).padStart(6, '0')}` }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section style={{ background: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #eee', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
            <div>
              <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>ORDER PLACED</p>
              <h1 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: '#202020' }}>{new Date(order.created_at).toLocaleDateString()}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>ORDER ID</p>
              <p style={{ margin: '8px 0 0', fontSize: '20px', fontWeight: 700 }}>SB-{String(order.id).padStart(6, '0')}</p>
            </div>
          </div>

          <div style={{ marginTop: '28px', display: 'grid', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px' }}>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>DELIVERY STATUS</p>
                <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: 700, color: order.status === 'Delivered' ? 'rgb(94, 148, 0)' : 'rgb(255, 153, 0)' }}>{order.status || 'Pending'}</p>
              </div>
              <div style={{ flex: '1 1 240px' }}>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>TOTAL AMOUNT</p>
                <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: 700 }}>₹{Number(order.total_price || 0).toFixed(2)}</p>
              </div>
              <div style={{ flex: '1 1 240px' }}>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>PAYMENT STATUS</p>
                <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: 700, color: order.payment_status === 'Paid' ? 'rgb(94, 148, 0)' : '#d97706' }}>{order.payment_status || 'Pending'}</p>
              </div>
              {order.delivery_slot && (
                <div style={{ flex: '1 1 240px' }}>
                  <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>DELIVERY SLOT</p>
                  <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: 700 }}>{order.delivery_slot}</p>
                </div>
              )}
            </div>

            {order.address && (
              <div style={{ background: '#f7f7f7', borderRadius: '12px', padding: '20px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#999' }}>DELIVERY ADDRESS</p>
                <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: 1.7 }}>{order.address}</p>
                {order.address_details && <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{order.address_details}</p>}
                {order.coordinates && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#888' }}>Pin: {Number(order.coordinates.lat).toFixed(6)}, {Number(order.coordinates.lon).toFixed(6)}</p>}
              </div>
            )}

            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
              <div style={{ padding: '20px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>ITEMS IN ORDER</p>
              </div>
              <div style={{ display: 'grid', gap: '12px', padding: '18px' }}>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #f1f1f1' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={item.product?.image_url || 'https://via.placeholder.com/64'} alt={item.product?.name || item.name || 'Item'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: '#202020' }}>{item.product?.name || item.name || 'Product'}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ minWidth: '90px', textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#202020' }}>₹{((item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: '#666' }}>No item details are available for this order.</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '18px', padding: '18px', borderRadius: '12px', background: '#fff7e6', border: '1px solid #fde3b7', color: '#7f5c00' }}>
              If your order is still pending, our team is working to confirm payment and prepare it for delivery. Visit Contact Us for help with delivery timing or order updates.
            </div>
          </div>
        </section>

        <aside style={{ display: 'grid', gap: '18px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #eee', boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>Order Summary</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Items</span><span>{Array.isArray(order.items) ? order.items.length : 0}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Sub total</span><span>₹{Number(order.total_price || 0).toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}><span>Payment</span><span>{order.payment_method || 'Not available'}</span></div>
            </div>
          </div>

          <button onClick={() => navigate('/orders')} style={{ padding: '14px', borderRadius: '10px', border: 'none', background: 'rgb(94, 148, 0)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>Back to orders</button>
        </aside>
      </div>
    </div>
  )
}
