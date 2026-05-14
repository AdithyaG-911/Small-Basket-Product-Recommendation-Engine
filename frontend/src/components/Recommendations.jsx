import React from 'react'
import ProductGrid from './ProductGrid'

export default function Recommendations({
  products,
  onAddToCart,
  onProductClick,
  onToggleSave,
  isSaved,
  onShowDetails,
  cartItemQuantities,
  onUpdateQuantity
}) {
  if (!products || products.length === 0) return null

  // Map recommendation_reason to explanation for display in ProductGrid
  const productsWithExplanation = products.map(product => ({
    ...product,
    explanation: product.recommendation_reason || 'Recommended for you'
  }))

  return (
    <div className="recommendations-grid">
      <ProductGrid
        products={productsWithExplanation}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onToggleSave={onToggleSave}
        isSaved={isSaved}
        onShowDetails={onShowDetails}
        cartItemQuantities={cartItemQuantities}
        onUpdateQuantity={onUpdateQuantity}
      />
    </div>
  )
}


