import React from 'react'

export default function Header({ cartCount, onCartClick, onHomeClick, onAccountClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={onHomeClick}>
          🛍️ ShopSmart
        </div>
        <nav className="nav">
          <button onClick={onHomeClick} className="nav-btn">Products</button>
          <button onClick={onAccountClick} className="nav-btn">Account</button>
          <button onClick={onCartClick} className="nav-btn cart-btn">
            🛒 Cart ({cartCount})
          </button>
        </nav>
      </div>
    </header>
  )
}
