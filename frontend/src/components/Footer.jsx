import React from 'react'

const POPULAR_CATEGORIES = [
  { label: 'Basmati Rice', category: 'Foodgrains, Oil & Masala' },
  { label: 'Green Tea', category: 'Beverages' },
  { label: 'OTC', category: 'Beauty & Hygiene' },
  { label: 'Cheese', category: 'Bakery, Cakes & Dairy' },
  { label: 'Dry Fruits', category: 'Foodgrains, Oil & Masala' },
  { label: 'Chocolates & Sweets', category: 'Snacks & Branded Foods' },
  { label: 'Soft Drinks', category: 'Beverages' },
  { label: 'Energy Drinks', category: 'Beverages' },
  { label: 'Bakery, Cakes & Dairy', category: 'Bakery, Cakes & Dairy' },
  { label: 'Olive Oils', category: 'Foodgrains, Oil & Masala' },
  { label: 'Foodgrains, Oil & Masala', category: 'Foodgrains, Oil & Masala' },
  { label: 'Sunflower Oils', category: 'Foodgrains, Oil & Masala' },
  { label: 'Liquid Soaps & Bars', category: 'Beauty & Hygiene' },
]

const POPULAR_BRANDS = [
  'Amul', "Haldiram's", 'Tropicana', "Kellogg's", 'Dettol', 'MTR',
  'BRU', 'McCain', 'Ariel', 'Britannia', 'Nescafe', 'Colgate',
  'Horlicks', 'Galaxy', 'Complan',
]

const CITIES_SERVED = [
  'Bangalore', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'New Delhi', 'Mysore',
  'Madurai', 'Kanpur', 'Kolkata', 'Lucknow', 'Ahmedabad', 'Patna', 'Gurgaon',
  'Jaipur', 'Chandigarh', 'Noida', 'Coimbatore', 'Vijayawada', 'Surat',
  'Vadodara', 'Visakhapatnam', 'Indore', 'Nagpur', 'Bhopal'
]

const liStyle = {
  lineHeight: '18.62px', paddingRight: '12px', whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis', width: '33.3333%',
  margin: '4px 0px', listStyle: 'none', boxSizing: 'border-box',
}

const linkStyle = {
  cursor: 'pointer', color: 'rgb(221, 221, 221)', textDecoration: 'none',
  backgroundColor: 'transparent', fontWeight: 400, fontSize: '14px',
}

export default function Footer({ onCategorySelect }) {
  return (
    <footer style={{ fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      {/* Categories & Brands section */}
      <div style={{ backgroundColor: 'rgb(32, 32, 32)', paddingTop: '24px', paddingBottom: '24px' }}>
        <div style={{
          maxWidth: '1440px', paddingRight: '156px', paddingLeft: '156px',
          margin: '0 auto', display: 'flex', gap: '40px', boxSizing: 'border-box',
        }}>
          {/* Popular Categories */}
          <div style={{ width: '50%' }}>
            <h4 style={{ color: 'rgb(255,255,255)', lineHeight: '18.62px', fontWeight: 600, fontSize: '14px', margin: '4px 0px' }}>
              Popular Categories
            </h4>
            <ul style={{ paddingLeft: '0px', flexWrap: 'wrap', width: '100%', display: 'flex', margin: '0px' }}>
              {POPULAR_CATEGORIES.map(({ label, category }) => (
                <li key={label} style={liStyle}>
                  <a
                    href="#"
                    style={linkStyle}
                    onClick={e => { e.preventDefault(); onCategorySelect && onCategorySelect(category) }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div style={{ width: '50%' }}>
            <h4 style={{ color: 'rgb(255,255,255)', lineHeight: '18.62px', fontWeight: 600, fontSize: '14px', margin: '4px 0px' }}>
              Popular Brands
            </h4>
            <ul style={{ paddingLeft: '0px', flexWrap: 'wrap', width: '100%', display: 'flex', margin: '0px' }}>
              {POPULAR_BRANDS.map(brand => (
                <li key={brand} style={liStyle}>
                  <a
                    href="#"
                    style={linkStyle}
                    onClick={e => { e.preventDefault(); onCategorySelect && onCategorySelect('All') }}
                  >
                    {brand}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Cities we serve section */}
      <div style={{ backgroundColor: 'rgb(32, 32, 32)', paddingTop: '24px', paddingBottom: '24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '1440px', paddingRight: '156px', paddingLeft: '156px',
          margin: '0 auto', boxSizing: 'border-box',
        }}>
          <h4 style={{ color: 'rgb(255, 255, 255)', lineHeight: '18.62px', fontWeight: 600, fontSize: '14px', margin: '4px 0px 12px 0px' }}>
            Cities We Serve
          </h4>
          <p style={{
            fontSize: '12px', color: 'rgb(221, 221, 221)', lineHeight: '22px', margin: '0',
            fontWeight: 400
          }}>
            {CITIES_SERVED.map((city, idx) => (
              <span key={city}>
                <a href="#" style={{ color: 'rgb(221, 221, 221)', textDecoration: 'none' }} onClick={e => e.preventDefault()}>{city}</a>
                {idx < CITIES_SERVED.length - 1 ? ' | ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{
        paddingTop: '2px', paddingBottom: '2px', backgroundColor: 'rgb(0,0,0)',
        height: '40px', boxSizing: 'content-box',
      }}>
        <div style={{
          maxWidth: '1440px', paddingRight: '156px', paddingLeft: '156px',
          color: 'rgb(255,255,255)', justifyContent: 'space-between',
          alignItems: 'center', height: '40px', display: 'flex',
          width: '100%', marginRight: 'auto', marginLeft: 'auto', boxSizing: 'border-box',
        }}>
          <span>Copyright © 2025-2027 Small Basket Pvt Ltd</span>
        </div>
      </div>
    </footer>
  )
}
