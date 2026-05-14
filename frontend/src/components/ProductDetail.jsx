import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductGrid from './ProductGrid'
import { API_BASE } from '../config'

const RED = 'rgb(204, 0, 0)'
const GREEN = 'rgb(94, 148, 0)'
const DARK = 'rgb(32, 32, 32)'
const LIGHT_GREEN = 'rgb(241, 248, 230)'

export default function ProductDetail({ 
  product, 
  onBack, 
  onAddToCart, 
  onToggleSave, 
  isSaved,
  cartItemQuantities,
  onUpdateQuantity
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [productData, setProductData] = useState(product)
  const [loading, setLoading] = useState(!product)
  const [selectedImage, setSelectedImage] = useState(product?.image_url)
  const [similarProducts, setSimilarProducts] = useState([])

  useEffect(() => {
    if (!productData && id) {
      setLoading(true)
      fetch(`${API_BASE}/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setProductData(data)
          setSelectedImage(data.image_url)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching product:', err)
          setLoading(false)
        })
        
      // Fetch similar products
      fetch(`${API_BASE}/products/${id}/similar`)
        .then(res => res.json())
        .then(data => {
          setSimilarProducts(data || [])
        })
        .catch(err => console.error('Error fetching similar products:', err))
    }
  }, [id, productData])

  useEffect(() => {
    if (productData) {
      const sizeStr = productData.size || productData.unit ? ` - ${productData.size || productData.unit}` : ''
      document.title = `Buy ${productData.brand ? productData.brand + ' ' : ''}${productData.name}${sizeStr} Online at Best Price - SmallBasket`
    }
    return () => {
      document.title = 'SmallBasket - Online Grocery Shopping'
    }
  }, [productData])

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading product details...</div>
  if (!productData) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found</div>

  const quantity = cartItemQuantities[productData.id] || 0
  const discountPercent = productData.mrp ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100) : 0

  // Breadcrumbs logic
  const categoryPath = productData.category ? productData.category.split('>') : []
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'ProximaNova, Arial, sans-serif' }}>
      {/* Top Bar: Breadcrumbs & Share */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '12px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </span>
          <span>/</span>
          {categoryPath.length > 0 ? (
            categoryPath.map((cat, i) => (
              <React.Fragment key={i}>
                <span style={{ textTransform: 'capitalize' }}>{cat.trim()}</span>
                {i < categoryPath.length - 1 && <span>/</span>}
              </React.Fragment>
            ))
          ) : (
            <span style={{ textTransform: 'capitalize' }}>{productData.category}</span>
          )}
          <span>/</span>
          <span style={{ fontWeight: 600, color: DARK }}>{productData.name}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Share on</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SocialIcon color="#3b5998" icon="f" url={window.location.href} title={productData.name} />
            <SocialIcon color="#1da1f2" icon="t" url={window.location.href} title={productData.name} />
            <SocialIcon color="#d44638" icon="e" url={window.location.href} title={productData.name} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '30px', marginTop: '20px' }}>
        {/* Left: Thumbnails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[productData.image_url, productData.image_url, productData.image_url, productData.image_url, productData.image_url].map((img, i) => (
            <div 
              key={i}
              onClick={() => setSelectedImage(img)}
              style={{
                width: '80px', height: '80px', border: selectedImage === img ? '1px solid ' + GREEN : '1px solid #eee',
                borderRadius: '4px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <img src={img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ))}
          <div style={{ textAlign: 'center', color: '#999', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* Center: Main Image */}
        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px', position: 'relative' }}>
          <img src={selectedImage} alt={productData.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>

        {/* Right: Product Info */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '14px', color: '#999', textDecoration: 'underline', marginBottom: '8px', cursor: 'pointer' }}>
              {productData.brand || 'Generic'}
            </div>
            <div style={{ 
              backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '40px', 
              padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 
            }}>
              <span style={{ color: GREEN }}>⚡</span> 10 MINS
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 600, color: DARK, margin: '0 0 15px 0', lineHeight: '1.3' }}>
            {productData.brand && <span style={{ textTransform: 'capitalize' }}>{productData.brand} </span>}
            {productData.name}
          </h1>

          {productData.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#5E9400', color: 'white', fontSize: '13px', fontWeight: 700, padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {productData.rating}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span style={{ fontSize: '14px', color: '#1a56db', textDecoration: 'underline', cursor: 'pointer' }}>
                {productData.reviewsCount} Ratings & {productData.reviews?.length || 0} Reviews
              </span>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            {productData.mrp && (
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                MRP: <span style={{ textDecoration: 'line-through' }}>₹{productData.mrp}</span>
              </div>
            )}
            <div style={{ fontSize: '18px', fontWeight: 400, marginBottom: '4px' }}>
              Price: <span style={{ fontWeight: 700 }}>₹{productData.price}</span> 
              <span style={{ fontSize: '12px', color: '#666' }}> (₹{productData.price} / pc)</span>
            </div>
            {discountPercent > 0 && (
              <div style={{ fontSize: '14px', color: GREEN, fontWeight: 600 }}>
                You Save: {discountPercent}% OFF
              </div>
            )}
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              (inclusive of all taxes)
            </div>
          </div>

          {/* Promo Strip */}
          {productData.isHarDinSasta && (
            <div style={{ 
              backgroundColor: LIGHT_GREEN, padding: '10px 15px', borderRadius: '4px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid #e4f1cc', marginBottom: '30px', cursor: 'pointer'
            }}>
              <span style={{ fontSize: '14px', color: '#2f4a00', fontWeight: 700 }}>Har Din Sasta!</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 2 }}>
              {quantity > 0 ? (
                <div style={{ display: 'flex', height: '48px', border: '1px solid ' + RED, borderRadius: '4px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => onUpdateQuantity(productData.id, quantity - 1)}
                    style={{ flex: 1, border: 'none', background: '#fff', color: RED, fontSize: '20px', cursor: 'pointer' }}
                  >-</button>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>
                    {quantity}
                  </div>
                  <button 
                    onClick={() => onUpdateQuantity(productData.id, quantity + 1)}
                    style={{ flex: 1, border: 'none', background: '#fff', color: RED, fontSize: '20px', cursor: 'pointer' }}
                  >+</button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onUpdateQuantity(productData.id, 1)
                    onAddToCart(productData.id)
                  }}
                  style={{ 
                    width: '100%', height: '48px', backgroundColor: RED, color: '#fff', border: 'none', 
                    borderRadius: '4px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' 
                  }}
                >
                  Add to basket
                </button>
              )}
            </div>
            
            <button 
              onClick={() => onToggleSave(productData.id)}
              style={{ 
                flex: 1, height: '48px', backgroundColor: '#fff', color: DARK, 
                border: '1px solid #ddd', borderRadius: '4px', fontWeight: 400, 
                fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved(productData.id) ? DARK : "none"} stroke="currentColor" strokeWidth="2" style={{ opacity: 0.8 }}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Save for later
            </button>
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px dashed #eee', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>About this product</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              {productData.description || 'Quality product sourced from the best vendors. Guaranteed freshness and taste.'}
            </p>
          </div>
          
          {/* Reviews Section */}
          {productData.reviews && productData.reviews.length > 0 && (
            <div style={{ marginTop: '40px', borderTop: '1px dashed #eee', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Ratings & Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {productData.reviews.map((rev, i) => (
                  <div key={i} style={{ borderBottom: i < productData.reviews.length - 1 ? '1px solid #eee' : 'none', paddingBottom: i < productData.reviews.length - 1 ? '20px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ backgroundColor: rev.rating >= 4 ? '#5E9400' : '#e23a14', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {rev.rating} ★
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: DARK }}>{rev.user}</span>
                      <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>{rev.date}</span>
                    </div>
                    <p style={{ margin: '0', fontSize: '13px', color: '#444', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <div style={{ marginTop: '60px', borderTop: '2px solid #f4f4f4', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: DARK, marginBottom: '24px' }}>
            Visually Similar Products
          </h2>
          <ProductGrid 
            products={similarProducts}
            onAddToCart={onAddToCart}
            onToggleSave={onToggleSave}
            isSaved={isSaved}
            cartItemQuantities={cartItemQuantities}
            onUpdateQuantity={onUpdateQuantity}
            onProductClick={(pid) => {
              setProductData(null) // reset to trigger fetch
              window.scrollTo({ top: 0, behavior: 'smooth' })
              navigate(`/product/${pid}`)
            }}
          />
        </div>
      )}
    </div>
  )
}

function SocialIcon({ color, icon, url, title }) {
  const handleClick = () => {
    if (icon === 'f') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    if (icon === 't') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out ' + title)}`, '_blank')
    if (icon === 'e') window.location.href = `mailto:?subject=${encodeURIComponent('Check out ' + title)}&body=${encodeURIComponent('I found this product and thought you might like it: ' + url)}`
  }

  return (
    <div 
      onClick={handleClick}
      style={{ 
      width: '28px', height: '28px', borderRadius: '50%', backgroundColor: color, 
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      fontSize: '14px', fontWeight: 700, cursor: 'pointer' 
    }}>
      {icon === 'f' && 'f'}
      {icon === 't' && '𝕏'}
      {icon === 'e' && '✉'}
    </div>
  )
}
