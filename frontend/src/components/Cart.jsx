import React, { useState, useEffect, useRef } from 'react'
import saveIcon from './save_icon.svg'
import { getProductUnitText, toSentenceCase } from '../utils/units'

const GREEN = 'rgb(94, 148, 0)'
const LIGHT_GREEN = 'rgb(241, 248, 230)'
const RED = 'rgb(204, 0, 0)'
const DARK = 'rgb(32, 32, 32)'

export default function Cart({ 
  cart, 
  onRemoveFromCart, 
  onUpdateQuantity,
  onCheckout, 
  onClearCart,
  checkoutLoading = false,
  savedItems = [],
  onSaveForLater,
  onMoveToCart,
  onRemoveFromSaved,
  recommendations = [],
  onAddToCart,
  onRemoveRecommendation
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [barVisible, setBarVisible] = useState(true)
  const [barMinimized, setBarMinimized] = useState(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Collapse bar when footer sentinel enters view
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => setBarMinimized(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  const cartProducts = cart.filter(item => item.product)
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const savings = cartProducts.reduce((sum, item) => sum + ((item.product.mrp || item.product.price || 0) - (item.product.price || 0)) * item.quantity, 0)
  const total = subtotal

  const renderHorizontalSection = (title, items, isSaved) => {
    if (items.length === 0) return null

    return (
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: DARK }}>{title}</h2>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '15px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}>
            {items.map(product => (
              <div key={product.id} style={{
                minWidth: '180px', width: '180px', border: '1px solid #eee', borderRadius: '8px',
                padding: '12px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>{product.brand || 'Generic'}</div>
                <div style={{ fontSize: '12px', fontWeight: 400, height: '32px', overflow: 'hidden', margin: '4px 0', color: DARK }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0' }}>₹{product.price}</div>
                <button 
                  onClick={() => isSaved ? onMoveToCart(product.id) : onAddToCart(product.id)}
                  style={{
                    width: '100%', padding: '8px', backgroundColor: '#fff', color: RED,
                    border: '1px solid ' + RED, borderRadius: '4px', fontWeight: 600,
                    cursor: 'pointer', fontSize: '12px', transition: '0.2s all'
                  }}
                  onMouseEnter={e => { e.target.style.backgroundColor = RED; e.target.style.color = '#fff' }}
                  onMouseLeave={e => { e.target.style.backgroundColor = '#fff'; e.target.style.color = RED }}
                >
                  {isSaved ? 'Move to Basket' : 'Add to Basket'}
                </button>
                <button 
                  onClick={() => isSaved ? onRemoveFromSaved(product.id) : onRemoveRecommendation(product.id)}
                  style={{
                    marginTop: '8px', background: 'none', border: 'none', color: '#999',
                    fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', alignSelf: 'center'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Swipe or scroll for more</span>
            <span style={{ letterSpacing: '0.18em' }}>→</span>
          </div>
        </div>
      </div>
    )
  }

  if (cartProducts.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'inherit' }}>
        <div style={{
          padding: '32px', backgroundColor: LIGHT_GREEN, borderRadius: '8px', 
          justifyContent: 'center', alignItems: 'center', flexDirection: 'column', 
          width: '100%', display: 'flex', marginTop: '40px', marginBottom: '40px',
          boxSizing: 'border-box'
        }}>
          <svg width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Z" fill="#E4F1CC"></path>
            <path d="M89.217 47.044H10.261v7.13h78.956v-7.13Z" fill="#fff"></path>
            <path d="M57.304 47.74H41.132v6.173h16.173V47.74Z" fill="#E4F1CC"></path>
            <path d="M79.13 91.566H20.697l-5.044-37.392h68l-4.521 37.392Z" fill="#fff"></path>
            <path d="M83.74 54.61H16.086v3.825H83.74V54.61Z" fill="#E4F1CC"></path>
            <path d="M41.217 54.348v3.392c0 4.434 3.653 8.087 8.087 8.087 4.435 0 8.087-3.652 8.087-8.087v-3.392H41.217Z" fill="#E4F1CC"></path>
            <path d="M20.435 46.435c0-6.174 5.043-11.217 11.217-11.217s11.305 5.043 11.305 11.217v.435l-22.522-.435Z" fill="#FF859E"></path>
            <path d="M29.74 35.392c5.39.956 9.478 5.739 9.304 11.478l3.826.087v-.435c.087-6.957-6.087-12.348-13.13-11.13Z" fill="#E06666"></path>
            <path d="M43.74 46.957 42 46.87v-.435c0-5.739-4.696-10.348-10.348-10.348-5.739 0-10.348 4.696-10.348 10.348h-1.739c0-6.695 5.479-12.087 12.087-12.087 6.609 0 12.087 5.479 12.087 12.087.087.174 0 .348 0 .522Z" fill="#476F00"></path>
            <path d="M66.522 46.957C72.087 33.566 72.782 20.61 68 18.783c-3.913-1.478-10.174 5.044-14.87 15.13v12.87l13.392.174Z" fill="#FFDCB4"></path>
            <path d="M70 20.783c-3.043-5.826-10.956.434-16.956 13.13v12.87H56v-4.174c.087-12.348 9.652-22.174 14-21.826Z" fill="#FFCBA4"></path>
            <path d="M80.957 46.87c.26-5.913-4.696-10.695-10.61-10.348l-3.651 10 14.26.348Z" fill="#C8E399"></path>
            <path d="M69.653 46.957c1.304-3.217 2.521-6.609 3.39-9.913l-3.304.26-3.13 9.48 3.044.173Z" fill="#E4F1CC"></path>
            <path d="M33.913 82.087c-1.304 0-2.435-1.13-2.435-2.435V61.913c0-1.304 1.13-2.434 2.435-2.434 1.305 0 2.435 1.13 2.435 2.434v17.74a2.43 2.43 0 0 1-2.435 2.434ZM49.391 82.957c-1.304 0-2.434-1.13-2.434-2.435v-17.74c0-1.303 1.13-2.434 2.434-2.434 1.305 0 2.435 1.13 2.435 2.435v17.74a2.43 2.43 0 0 1-2.435 2.434Z" fill="#ADD566"></path>
            <path d="M49.13 59.478c-1.304 0-2.434 1.131-2.434 2.435v5.044c.782.26 1.739.435 2.608.435.783 0 1.566-.087 2.261-.348v-5.13c0-1.305-1.13-2.436-2.434-2.436Z" fill="#F1F8E6"></path>
            <path d="M63.13 82.087c-1.304 0-2.434-1.13-2.434-2.435V61.913c0-1.304 1.13-2.434 2.435-2.434 1.304 0 2.434 1.13 2.434 2.434v17.74a2.43 2.43 0 0 1-2.434 2.434Z" fill="#ADD566"></path>
            <path d="M49.74 62.522c-2.088 0-3.827-1.74-3.827-3.826v-47.74c0-2.086 1.74-3.825 3.826-3.825 2.087 0 3.826 1.739 3.826 3.826v47.739c0 2.087-1.739 3.826-3.826 3.826Z" fill="#fff"></path>
            <path d="M23.044 32.957c-3.218 0-5.74-3.13-5.74-3.13s2.609-3.131 5.74-3.131c3.217 0 5.739 3.13 5.739 3.13s-2.61 3.13-5.74 3.13Z" fill="#C8E399"></path>
            <path d="M16.087 29.827c4.696-5.653 9.74-4.957 13.826 0-4.695 5.652-9.739 4.87-13.826 0Zm2.348 0c3.044 2.87 6 3.043 9.13 0-3.043-2.957-6-3.044-9.13 0ZM45.218 54.696H9.565V46h34.783v1.74H11.304v5.217h33.913v1.739ZM90.435 54.696H54.783v-1.74h33.913V47.74H53.044V46h37.39v8.696Z" fill="#476F00"></path>
            <path d="M49.13 63.479c-2.695 0-4.869-2.174-4.869-4.783V10.783C44.261 8.174 46.435 6 49.044 6c2.695 0 4.87 2.174 4.87 4.783v47.913c0 2.609-2.175 4.783-4.783 4.783Zm-3.043-52.696v47.913a2.932 2.932 0 0 0 2.957 2.957h.087a2.932 2.932 0 0 0 2.956-2.957V10.783c.087-4-6-3.913-6 0ZM81.826 46.957l-1.74-.087c.175-5.478-4.347-9.826-9.651-9.478l-.087-1.74c6.435-.347 11.739 4.957 11.478 11.305Z" fill="#476F00"></path>
            <path d="m67.304 47.305-1.565-.696c.261-.696.522-1.304.783-2 4.956-13.044 4.608-23.652 1.13-24.957-3.304-1.304-9.217 4.957-13.739 14.61l-1.565-.784C65.39 5.74 79.913 17.305 67.304 47.305ZM31.217 79.13V61.567c0-1.74 1.305-3.392 3.566-3.392 1.913 0 3.39 1.565 3.39 3.392V79.13c.088 4.522-6.956 4.608-6.956 0Zm1.827-17.564V79.13c0 .87.608 1.652 1.826 1.652.87 0 1.652-.696 1.652-1.652V61.565c0-.87-.696-1.652-1.652-1.652-1.218.087-1.826.783-1.826 1.653ZM49.391 83.652a3.303 3.303 0 0 1-3.304-3.304V61.652h1.74v18.696c0 .87.608 1.565 1.912 1.565.87 0 1.565-.695 1.565-1.565V60.783h1.74v19.565c0 1.565-1.13 3.304-3.653 3.304ZM63.391 82.61c-1.913 0-3.39-1.566-3.39-3.392V61.566c0-4.61 7.043-4.522 7.043 0V79.13c-.087 1.826-1.392 3.478-3.653 3.478Zm0-22.61c-.87 0-1.652.696-1.652 1.653v17.565c0 .87.696 1.652 1.652 1.652h.174c.87 0 1.653-.696 1.653-1.652V61.566c0-.87-.696-1.653-1.653-1.653h-.174V60ZM50.348 58.175c0 .608-.522 1.13-1.13 1.13-.61 0-1.131-.522-1.131-1.13 0-.61.522-1.13 1.13-1.13.696 0 1.13.52 1.13 1.13ZM32.174 25.13h-1.74v13.044h1.74V25.131Z" fill="#476F00"></path>
            <path d="M31.305 28.609h-2.61v1.74h2.61v-1.74ZM67.268 29.534l-.679 1.601 3.843 1.63.679-1.601-3.843-1.63ZM65.877 35.85l-.697 1.593 3.745 1.638.697-1.594-3.745-1.638ZM63.685 41.828l-.697 1.593 3.745 1.638.697-1.593-3.745-1.638ZM84.348 90.348H79.13v1.74h5.218v-1.74ZM20 90.348h-5.217v1.74H20v-1.74Z" fill="#476F00"></path>
            <path d="M80 92.087H19.304l-4.782-39.13h31.565v1.739H16.435l4.435 35.652h57.652l4.608-35.652H53.913v-1.74H85.13L80 92.088Z" fill="#476F00"></path>
            <path d="M55.652 86h-2.608v1.74h2.608V86ZM50.435 86h-2.609v1.74h2.609V86ZM45.218 86h-2.61v1.74h2.61V86Z" fill="#ADD566"></path>
          </svg>
          <div style={{
            fontSize: isMobile ? '20px' : '24px', justifyContent: 'center', display: 'flex', marginTop: '20px', marginBottom: '20px', 
            fontWeight: 400, textAlign: 'center'
          }}>
            <span style={{ fontWeight: 100, color: 'rgb(47, 74, 0)' }}>Let's fill the empty </span>
            &nbsp;
            <span style={{ fontWeight: 100, color: 'rgb(118, 185, 0)' }}>Basket</span>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              height: '40px', width: '12.5rem', border: '1.6px solid ' + RED, 
              fontWeight: 600, padding: '6px 18px', color: '#fff', cursor: 'pointer', 
              backgroundColor: RED, borderRadius: '4px', fontSize: '16px'
            }}
          >
            Continue Shopping
          </button>
        </div>

        {/* Sections for Saved Items and Recommendations */}
        {renderHorizontalSection("Saved For Later", savedItems, true)}
        {renderHorizontalSection("Before you checkout", recommendations, false)}
      </div>
    )
  }

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '10px' : '20px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 700, marginBottom: '20px' }}>Your Basket ({cartProducts.length} items)</h1>
      
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '30px' }}>
        {/* Left: Cart Items */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
              <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Item Description</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Unit Price</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Subtotal</th>
                  <th style={{ padding: '12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', display: 'flex', gap: '15px' }}>
                      <img src={item.product.image_url} alt={toSentenceCase(item.product.name)} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>{toSentenceCase(item.product.brand || 'Generic')}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: DARK }}>{toSentenceCase(item.product.name)}</div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>
                      <div>₹{item.product.price}</div>
                      {getProductUnitText(item.product) && (
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>per {toSentenceCase(getProductUnitText(item.product))}</div>
                      )}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <button 
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '18px' }}
                        >-</button>
                        <span style={{ padding: '0 10px', minWidth: '30px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer', fontSize: '18px' }}
                        >+</button>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontSize: '16px', fontWeight: 700 }}>₹{item.product.price * item.quantity}</td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => onSaveForLater(item.product_id)}
                          title="Save for later"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <img src={saveIcon} alt="Save" style={{ width: '20px', height: '20px', opacity: 0.6 }} />
                        </button>
                        <button 
                          onClick={() => onRemoveFromCart(item.product_id)}
                          style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px' }}
                          title="Remove"
                        >×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={onClearCart || (() => window.location.href = '/')} 
              style={{ padding: '10px 20px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
            >Empty Basket</button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ padding: '10px 20px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
            >Continue Shopping</button>
          </div>

          {/* Saved Items Section */}
          {savedItems.length > 0 && renderHorizontalSection("Saved For Later", savedItems, true)}
          
          {/* Recommendations Section */}
          {recommendations.length > 0 && renderHorizontalSection("Before you checkout", recommendations, false)}
        </div>

      </div>

      {/* Footer sentinel — bar collapses when this is visible */}
      <div ref={sentinelRef} style={{ height: '1px' }} />
    </div>

    {/* ── Sticky Proceed to Checkout Bar ── */}
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      transform: barMinimized ? 'translateY(100%)' : 'translateY(0)',
      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: barMinimized ? 'none' : 'auto',
    }}>
      <div style={{
        backgroundColor: 'rgb(32,32,32)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.18)',
        fontFamily: 'ProximaNova,Helvetica,Arial,sans-serif',
      }}>
        <div style={{
          maxWidth: '1440px', margin: '0 auto',
          padding: '0 40px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        }}>
          {/* Left: item count + total */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: 'rgb(179,179,179)', lineHeight: 1 }}>{cartProducts.length} item{cartProducts.length !== 1 ? 's' : ''}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>₹{total.toFixed(2)}</span>
                {savings > 0 && (
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, paddingBottom: '2px' }}>
                    Savings: ₹{savings.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: '13px', color: 'rgb(179,179,179)' }}>+ delivery charges</span>
          </div>

          {/* Right: CTA */}
          <button
            onClick={onCheckout}
            disabled={checkoutLoading}
            style={{
              height: '40px', padding: '0 32px',
              backgroundColor: checkoutLoading ? '#888' : 'rgb(204,0,0)',
              color: '#fff', border: 'none', borderRadius: '4px',
              fontWeight: 700, fontSize: '16px', letterSpacing: '0.25px',
              cursor: checkoutLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            {checkoutLoading ? 'Processing…' : 'Proceed to Checkout'}
            {!checkoutLoading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
    {/* spacer so page content isn't hidden behind the bar */}
    <div style={{ height: '64px' }} />
    </>
  )
}
