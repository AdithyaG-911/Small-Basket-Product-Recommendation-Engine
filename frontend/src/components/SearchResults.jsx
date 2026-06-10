import React, { useState } from 'react'
import ProductGrid from './ProductGrid'

export default function SearchResults({ 
  products, 
  totalProducts, 
  searchQuery, 
  onAddToCart, 
  onProductClick, 
  onToggleSave, 
  isSaved, 
  onShowDetails, 
  cartItemQuantities, 
  onUpdateQuantity,
  activeCategory,
  onCategorySelect,
  loadMoreProducts,
  breadcrumbCategory,   // explicit category label for breadcrumb (set when navigating from quick-link)
  onResetFilters,       // clears both search and category
  onSubCategorySelect,  // click handler for dynamic filters
  subCategoryFilter = '' // currently active sub-category filter for sidebar highlighting
}) {
  const [showFilters, setShowFilters] = useState(true)
  const [sortBy, setSortBy] = useState('Relevance')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Dynamically group products into categories and subcategories
  const categoryGroups = {}
  const safeText = (value) => {
    const text = String(value || '').trim()
    if (!text) return ''
    return text
  }
  const getSubCategory = (product) => {
    const candidate = safeText(product.subcategory) || safeText(product.brand) || safeText(product.vendor)
    if (candidate) return candidate
    if (product.name) {
      const tokens = product.name.split(' ').filter(Boolean)
      return tokens.length > 0 ? safeText(tokens[0]) : 'General'
    }
    return 'General'
  }
  products.forEach(p => {
    const mainCat = safeText(p.category) || safeText(p.subcategory) || safeText(p.type) || 'Others'
    const subCat = getSubCategory(p)
    if (!categoryGroups[mainCat]) {
      categoryGroups[mainCat] = new Set()
    }
    categoryGroups[mainCat].add(subCat)
  })

  // Convert Sets to Arrays for rendering
  const dynamicFilters = Object.keys(categoryGroups).map(mainCat => ({
    name: mainCat,
    subcategories: Array.from(categoryGroups[mainCat]).slice(0, 8)
  }))

  const subCategories = dynamicFilters.map(df => df.name)

  const sortOptions = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Alphabetical (A-Z)',
    'Discount - High to Low'
  ]

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'Price - Low to High':
        return a.price - b.price
      case 'Price - High to Low':
        return b.price - a.price
      case 'Alphabetical (A-Z)':
        return a.name.localeCompare(b.name)
      case 'Discount - High to Low':
        return (b.discount || 0) - (a.discount || 0)
      default:
        return 0 // Relevance (keep as is)
    }
  })

  const containerStyle = {
    maxWidth: '1440px',
    paddingRight: '156px',
    paddingLeft: '156px',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', ...containerStyle }}>
      {/* Breadcrumb Navbar */}
      <div style={{ boxSizing: 'border-box', borderBottom: '0.8px dashed rgb(213, 213, 213)', marginTop: '10px', paddingBottom: '12px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '14px', color: 'rgb(13, 19, 0)', flexWrap: 'wrap', gap: '2px' }}>
        {/* Home */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); onResetFilters ? onResetFilters() : onCategorySelect && onCategorySelect('All') }} style={{ alignItems: 'center', display: 'flex', cursor: 'pointer', color: 'rgb(13, 19, 0)', textDecoration: 'none' }}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', marginRight: '2px', display: 'block', verticalAlign: 'middle' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.242 15H12V9.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75V15H3.75l.005-6.313 5.244-5.363 5.251 5.394L14.242 15ZM7.5 15h3v-4.5h-3V15Zm7.818-7.361L9.536 1.726a.772.772 0 0 0-1.072 0L2.68 7.64a1.556 1.556 0 0 0-.431 1.078V15c0 .827.635 1.5 1.416 1.5h10.667c.781 0 1.417-.673 1.417-1.5V8.718c0-.404-.158-.797-.432-1.08Z" fill="#202020"></path>
            </svg>
            <span style={{ lineHeight: '20px', fontSize: '14px', color: 'rgb(32, 32, 32)', fontWeight: 400 }}>Home</span>
          </a>
          <span style={{ padding: '0 8px', color: 'rgb(144, 144, 144)' }}>/</span>
        </div>

        {/* Category crumb — activeCategory (L1) */}
        {activeCategory && activeCategory !== 'All' && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onCategorySelect && onCategorySelect(activeCategory) }}
              style={{ lineHeight: '20px', fontSize: '14px', color: 'rgb(32, 32, 32)', fontWeight: (breadcrumbCategory && breadcrumbCategory !== activeCategory) || searchQuery ? 400 : 600, textDecoration: 'none', cursor: 'pointer' }}
            >
              {activeCategory}
            </a>
            {((breadcrumbCategory && breadcrumbCategory !== activeCategory) || searchQuery) && <span style={{ padding: '0 8px', color: 'rgb(144, 144, 144)' }}>/</span>}
          </div>
        )}

        {/* Sub-Category crumb — breadcrumbCategory (L2/L3) */}
        {breadcrumbCategory && breadcrumbCategory !== activeCategory && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); /* do nothing, already here */ }}
              style={{ lineHeight: '20px', fontSize: '14px', color: 'rgb(32, 32, 32)', fontWeight: searchQuery ? 400 : 600, textDecoration: 'none', cursor: 'default' }}
            >
              {breadcrumbCategory}
            </a>
            {searchQuery && <span style={{ padding: '0 8px', color: 'rgb(144, 144, 144)' }}>/</span>}
          </div>
        )}

        {/* Current page — the search query */}
        {searchQuery && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ lineHeight: '20px', fontSize: '14px', color: 'rgb(32, 32, 32)', fontWeight: 600 }}>
              {searchQuery}
            </span>
          </div>
        )}
      </div>

      {/* Search Stats */}
      <div style={{ paddingTop: '20px', display: 'flex', alignItems: 'baseline', fontWeight: 400, flexWrap: 'wrap', gap: '4px' }}>
        {searchQuery.trim() ? (
          <>
            <span style={{ fontWeight: 700, fontSize: '18px', lineHeight: '25.2px', color: 'rgb(48, 48, 48)' }}>{totalProducts}</span>
            <h2 style={{ fontWeight: 300, fontSize: '18px', margin: '0px', lineHeight: '25.2px', color: 'rgb(32, 32, 32)' }}>&nbsp;result for "{searchQuery}"</h2>
          </>
        ) : (
          <>
            <h2 style={{ fontWeight: 700, fontSize: '18px', margin: '0px', lineHeight: '25.2px', color: 'rgb(32, 32, 32)' }}>
              {breadcrumbCategory || activeCategory}
            </h2>
            <span style={{ fontWeight: 300, fontSize: '15px', color: 'rgb(100, 100, 100)', marginLeft: '8px' }}>— {totalProducts} products</span>
          </>
        )}
      </div>

      {/* Category Chips Grid — derived from real result categories */}
      {subCategories.length > 0 && (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'rgb(0, 0, 0)', lineHeight: '21px', fontSize: '14px', fontWeight: 600, marginRight: '4px', flexShrink: 0 }}>Filter by:</span>
          {subCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onCategorySelect && onCategorySelect(cat)}
              style={{
                padding: '6px 18px', fontWeight: activeCategory === cat ? 700 : 500,
                color: activeCategory === cat ? 'rgb(94, 148, 0)' : 'rgb(32, 32, 32)',
                cursor: 'pointer',
                backgroundColor: activeCategory === cat ? 'rgb(228, 241, 204)' : 'rgb(255, 255, 255)',
                fontSize: '13px', height: '36px',
                border: activeCategory === cat ? '1.6px solid rgb(94, 148, 0)' : '1px solid #ddd',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderRadius: '4px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                transition: 'all 0.15s ease', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.borderColor = 'rgb(94,148,0)' }}
              onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.borderColor = '#ddd' }}
            >
              {cat}
            </button>
          ))}
          {activeCategory && activeCategory !== 'All' && (
            <button
              onClick={() => onCategorySelect && onCategorySelect('All')}
              style={{ padding: '6px 14px', fontSize: '13px', height: '36px', border: '1px solid #ccc', borderRadius: '4px', background: '#f7f7f7', cursor: 'pointer', color: '#666', fontWeight: 500 }}
            >
              ✕ Clear filter
            </button>
          )}
        </div>
      </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.8px solid #eee', borderBottom: '0.8px solid #eee', padding: '12px 0', marginBottom: '24px' }}>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '0.8px solid #ccc', 
            borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          {showFilters ? 'Hide Filter' : 'Show Filter'}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 30px', border: '0.8px solid rgb(48, 48, 48)', 
              borderRadius: '4px', background: 'rgb(48, 48, 48)', color: 'rgb(255, 255, 255)', cursor: 'pointer', fontSize: '16px',
              fontWeight: 600, height: '40px'
            }}
          >
            <span style={{ fontWeight: 600 }}>{sortBy}</span>
            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M10.583 17.417a.917.917 0 1 1 0-1.834.917.917 0 0 1 0 1.834Zm9.167-1.834h-6.587a2.745 2.745 0 0 0-2.58-1.833c-1.193 0-2.2.77-2.58 1.833H3.25a.916.916 0 1 0 0 1.834h4.753a2.745 2.745 0 0 0 2.58 1.833c1.194 0 2.2-.77 2.58-1.833h6.587a.916.916 0 1 0 0-1.834Zm-1.834-3.666a.917.917 0 1 1 .001-1.834.917.917 0 0 1 0 1.834Zm0-3.667c-1.193 0-2.2.77-2.58 1.833H3.25a.916.916 0 1 0 0 1.834h12.086a2.745 2.745 0 0 0 2.58 1.833 2.753 2.753 0 0 0 2.75-2.75 2.753 2.753 0 0 0-2.75-2.75Zm-11-3.667a.917.917 0 1 1 0 1.834.917.917 0 0 1 0-1.834ZM3.25 6.417h1.086a2.745 2.745 0 0 0 2.58 1.833c1.194 0 2.201-.77 2.58-1.833H19.75a.916.916 0 1 0 0-1.834H9.497a2.745 2.745 0 0 0-2.58-1.833c-1.194 0-2.202.77-2.581 1.833H3.25a.916.916 0 1 0 0 1.834Z" fill="currentColor"/>
            </svg>
          </button>

          {showSortDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 100,
              minWidth: '200px',
              padding: '8px 0'
            }}>
              {sortOptions.map(option => (
                <div 
                  key={option}
                  onClick={() => {
                    setSortBy(option)
                    setShowSortDropdown(false)
                  }}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: sortBy === option ? '#f5f5f5' : 'transparent',
                    color: sortBy === option ? 'rgb(94, 148, 0)' : '#333',
                    fontWeight: sortBy === option ? 600 : 400
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = sortBy === option ? '#f5f5f5' : 'transparent'}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Layout */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Filters */}
        {showFilters && (
          <div style={{ width: '210px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1.6px solid #5e9400', paddingBottom: '8px', width: 'fit-content' }}>Shop by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dynamicFilters.map(filter => (
                <div key={filter.name} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#333' }}>{filter.name}</div>
                  <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#666' }}>
                    {filter.subcategories.map(sub => (
                      <span 
                        key={sub} 
                        style={{ cursor: 'pointer', transition: 'color 0.2s', color: subCategoryFilter === sub ? '#5e9400' : '#666', fontWeight: subCategoryFilter === sub ? 600 : 400 }} 
                        onClick={() => onSubCategorySelect && onSubCategorySelect(filter.name, sub)}
                        onMouseEnter={e => e.currentTarget.style.color = '#5e9400'}
                        onMouseLeave={e => e.currentTarget.style.color = subCategoryFilter === sub ? '#5e9400' : '#666'}
                      >
                        {sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div style={{ flex: 1 }}>
          <ProductGrid
            products={sortedProducts}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
            onToggleSave={onToggleSave}
            isSaved={isSaved}
            onShowDetails={onShowDetails}
            cartItemQuantities={cartItemQuantities}
            onUpdateQuantity={onUpdateQuantity}
          />
          
          {products.length < totalProducts && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '60px' }}>
              <button
                onClick={loadMoreProducts}
                style={{
                  padding: '12px 24px', backgroundColor: 'rgb(94, 148, 0)', color: '#fff',
                  border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Load More Products ({products.length} of {totalProducts})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
