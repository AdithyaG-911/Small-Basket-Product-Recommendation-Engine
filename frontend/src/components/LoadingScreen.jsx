import React from 'react'
import logoImage from '../../logo.png'

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-panel">
        <div className="loading-logo">
          <img src={logoImage} alt="SmallBasket" />
        </div>
        <h1>SmallBasket</h1>
        <p>Loading the storefront, preparing search, and bringing your basket back into view.</p>
        <div className="loading-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
