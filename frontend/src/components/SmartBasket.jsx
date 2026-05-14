import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProductGrid from './ProductGrid'

export default function SmartBasket({ recommendations = [], onAddToCart, onToggleSave, isSaved, cartItemQuantities, onUpdateQuantity }) {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      {/* Breadcrumbs */}
      <div style={{ paddingTop: '8px', paddingBottom: '8px', borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '0.8px', borderWidth: '0px 0px 0.8px', borderStyle: 'solid', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '14px', color: 'rgb(13, 19, 0)' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} style={{ cursor: 'pointer', color: 'rgb(32, 32, 32)', textDecoration: 'none' }}>Home</a>
          <span style={{ padding: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>Smart Basket</span>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'rgb(32, 32, 32)', marginBottom: '10px' }}>Your Smart Basket</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Personalized recommendations based on your shopping habits and interests.</p>
      </div>

      {recommendations.length > 0 ? (
        <ProductGrid 
          products={recommendations}
          onAddToCart={onAddToCart}
          onToggleSave={onToggleSave}
          isSaved={isSaved}
          cartItemQuantities={cartItemQuantities}
          onUpdateQuantity={onUpdateQuantity}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>Your Smart Basket is getting ready</h3>
          <p style={{ color: '#999' }}>Start browsing and adding items to see personalized suggestions here!</p>
          <button 
            onClick={() => navigate('/')}
            style={{ marginTop: '20px', padding: '12px 24px', background: 'rgb(94, 148, 0)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
          >
            START BROWSING
          </button>
        </div>
      )}
    </div>
  )
}
