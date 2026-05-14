import React from 'react'

export default function BrowsingHistory({ history, products, onAddToCart, onProductClick }) {
  const sortedHistory = [...history].filter(item => item.product).sort((a, b) =>
    new Date(b.visited_at) - new Date(a.visited_at)
  )

  return (
    <div className="page browsing-history">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Recently viewed</h1>
          <p>Products you open here help the recommendation engine learn what to surface next.</p>
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="empty-history">
          <p>You have not viewed any products yet</p>
          <p className="hint">Start exploring to see your browsing history here.</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedHistory.map((item) => {
            const viewedDate = new Date(item.visited_at)
            const timeAgo = getTimeAgo(viewedDate)

            return (
              <div key={item.id} className="history-item">
                <div className="item-image">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} />
                  ) : (
                    <div className="placeholder">No image</div>
                  )}
                </div>
                <div className="item-info">
                  <h3>
                    <button type="button" onClick={() => onProductClick(item.product.id)}>
                      {item.product.name}
                    </button>
                  </h3>
                  <p className="category">{item.product.category}</p>
                  <p className="description">{getPreviewText(item.product.description)}</p>
                  <p className="viewed-time">Viewed {timeAgo}</p>
                </div>
                <div className="item-price">
                  <span className="price">Rs. {item.product.price}</span>
                </div>
                <button
                  className="primary-button history-add-btn"
                  onClick={() => onAddToCart(item.product.id)}
                  type="button"
                >
                  Add to cart
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(date) {
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getPreviewText(description) {
  if (!description) {
    return 'A previously explored item from your browsing activity.'
  }

  return description.length > 100 ? `${description.slice(0, 100)}...` : description
}
