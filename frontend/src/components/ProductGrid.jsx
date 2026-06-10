import React, { useState } from 'react'
import plusIcon from './plus.svg'
import minusIcon from './minus.svg'
import saveIcon from './save_icon.svg'
import { getProductUnitText, toSentenceCase, toTitleCase, getPlaceholderColor, getCategoryPlaceholderSVG } from '../utils/units'

export default function ProductGrid({
  products,
  onAddToCart,
  onProductClick,
  onSaveItem,
  onToggleSave,
  isSaved,
  onShowDetails,
  cartItemQuantities,
  onUpdateQuantity
}) {
  const [imageErrors, setImageErrors] = useState({})
  const [hoveredSaveId, setHoveredSaveId] = useState(null)

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }))
  }

  const toTitleCase = (str) => {
    if (!str) return ''
    return String(str)
      .split(/\s+/)
      .map((w) => {
        // keep small words like & as-is
        if (w.length === 0) return w
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      })
      .join(' ')
      .replace(/\s+&\s+/g, ' & ')
  }

  const toSentenceCase = (str) => {
    if (!str) return ''
    const s = String(str).trim()
    if (s.length === 0) return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  const formatCategory = (cat) => {
    if (!cat) return ''
    const map = {
      'beauty & hygiene': 'Beauty & hygiene',
      'foodgrains, oil & masala': 'Foodgrains, oil & masala',
      'cleaning & household': 'Cleaning & household',
      'gourmet & world food': 'Gourmet & world food',
      'kitchen, garden & pets': 'Kitchen, garden & pets',
      'baby care': 'Baby care',
      'beverages': 'Beverages',
      'bakery, cakes & dairy': 'Bakery, cakes & dairy',
      'snacks & branded foods': 'Snacks & branded foods',
      'eggs, meat & fish': 'Eggs, meat & fish',
      'fruits & vegetables': 'Fruits & vegetables'
    }
    const key = String(cat).trim().toLowerCase()
    return map[key] || toSentenceCase(cat)
  }

  const getPlaceholderImage = (category) => {
    const colors = {
      'beauty & hygiene': '#f3e5ab',
      'bath & hand wash': '#e8f5e9',
      'cosmetics': '#fce4ec',
      'skincare': '#e1f5fe',
      'haircare': '#fff3e0',
      'nutrition': '#f3e5f5',
      'groceries': '#e8f5e9',
      'fresh produce': '#c8e6c9',
      'fruits': '#ffccbc',
      'electronics': '#b3e5fc',
      'fashion': '#f8bbd0',
      'home': '#ffe0b2',
      'sports': '#b2dfdb',
      'books': '#d1c4e9',
      'toys': '#ffccbc',
      'food': '#fff9c4',
    }
    return colors[category?.toLowerCase()] || '#f5f5f5'
  }

  // product unit formatting moved to shared helper

  return (
    <div className="product-grid">
      {products.map((product) => {
        const unitText = getProductUnitText(product)
        return (
          <article key={product.id} className="product-card bb-product-card">
          <div
            className="product-image-container"
            onClick={() => {
              onProductClick(product.id)
            }}
          >
            <div className="product-image-inner">
              {product.image_url && !imageErrors[product.id] ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={() => handleImageError(product.id)}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="product-main-img"
                />
              ) : (
                <div
                  className="placeholder"
                  style={{ backgroundColor: getPlaceholderColor(product.category), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#444' }}
                >
                  <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getCategoryPlaceholderSVG(product.category)}
                  </div>
                  <span style={{ marginTop: 8, fontSize: '12px', color: '#333' }}>{toTitleCase(product.category) || 'Product'}</span>
                </div>
              )}

              {product.discount > 0 && (
                <div className="discount-tag" style={{ position: 'absolute', top: '0px', left: '0px', backgroundColor: '#e23a14', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderBottomRightRadius: '4px' }}>
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </div>

          <div className="product-info-section">
            <div className="badge-row" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
              {product.isHarDinSasta && (
                <div style={{ backgroundColor: '#f0f5ff', color: '#1a56db', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', border: '1px solid #c3ddfd' }}>
                  Har Din Sasta
                </div>
              )}
            </div>

            <div className="brand-name">{toSentenceCase(product.brand || product.vendor || (product.name ? product.name.split(' ')[0] : 'Fresho!'))}</div>
            <h3 className="product-title-text" onClick={() => { onProductClick(product.id); }}>
              {toSentenceCase(product.name)}
            </h3>

            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', marginBottom: '2px' }}>
                <div style={{ backgroundColor: '#5E9400', color: 'white', fontSize: '10px', fontWeight: 600, padding: '1px 4px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {product.rating}
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '11px', color: '#666' }}>({product.reviewsCount} Ratings)</span>
              </div>
            )}

            {unitText && (
              <div className="size-selector">
                <span>{toSentenceCase(unitText)}</span>
              </div>
            )}

            {product.explanation && (
              <div className="product-explanation" style={{ 
                fontSize: '11px', color: '#10b981', marginTop: '6px', 
                fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2'
              }}>
                ✨ {product.explanation}
              </div>
            )}

            <div className="price-section">
              <div className="current-price">₹{product.price}</div>
              {unitText && (
                <div className="unit-text" style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  per {toSentenceCase(unitText)}
                </div>
              )}
              {product.mrp && <div className="mrp-price">₹{product.mrp}</div>}
            </div>
          </div>

          <div className="product-card-actions">
            <button
              className={`save-action-btn ${isSaved(product.id) ? 'active' : ''}`}
              onMouseEnter={() => setHoveredSaveId(product.id)}
              onMouseLeave={() => setHoveredSaveId(null)}
              onClick={(e) => {
                e.stopPropagation()
                onToggleSave && onToggleSave(product.id, product)
              }}
              type="button"
              aria-label="Save for later"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style={{ overflow: 'visible' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.821 15.506c.169 0 .339.043.492.129L17 18.285V5.335c0-.201-.121-.334-.2-.334H7.2c-.08 0-.2.133-.2.334v12.9l4.306-2.585c.159-.095.337-.143.515-.143ZM6 21a1 1 0 0 1-1-1V5.334C5 4.047 5.987 3 7.2 3h9.6C18.013 3 19 4.047 19 5.334V20a1 1 0 0 1-1.492.87l-5.672-3.207-5.322 3.195A1.006 1.006 0 0 1 6 21Z" fill="#202020"></path>
                {isSaved(product.id) && (
                  <g transform="translate(14, -2)">
                    <circle cx="6" cy="6" r="6" fill="#5E9400" stroke="#fff" strokeWidth="1.5" />
                    <path d="M3.5 6L5.5 8L8.5 4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </svg>
              {hoveredSaveId === product.id && (
                <div className="save-tooltip">
                  {isSaved(product.id) ? 'Remove Product' : 'Save For Later'}
                </div>
              )}
            </button>

            <div className="add-to-cart-container">
              {cartItemQuantities[product.id] && cartItemQuantities[product.id] > 0 ? (
                <div className="qty-selector">
                  <button
                    className="qty-change-btn"
                    onClick={() => onUpdateQuantity(product.id, Math.max(0, (cartItemQuantities[product.id] || 1) - 1))}
                    type="button"
                  >
                    <img src={minusIcon} alt="minus" />
                  </button>
                  <span className="qty-num">{cartItemQuantities[product.id] || 1}</span>
                  <button
                    className="qty-change-btn"
                    onClick={() => onUpdateQuantity(product.id, (cartItemQuantities[product.id] || 1) + 1)}
                    type="button"
                  >
                    <img src={plusIcon} alt="plus" />
                  </button>
                </div>
              ) : (
                <button
                  className="add-btn-outline"
                  onClick={() => onAddToCart(product.id)}
                  type="button"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </article>
        )
      })}
    </div>
  )
}

function getPreviewText(description) {
  if (!description) {
    return 'Explore this product and add to your cart.'
  }

  return description.length > 88 ? `${description.slice(0, 88)}...` : description
}
