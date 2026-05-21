import React, { useState, useEffect, useRef } from 'react'
import logoImage from '../../logo.png'
import faviconImage from '../../favicon.png'
import { API_BASE } from '../config'

// ─── BigBasket‑style colour palette ────────────────────────────────────────
const GREEN = 'rgb(94, 148, 0)'
const DARK_GREEN = 'rgb(118, 185, 0)'
const DARK = 'rgb(32, 32, 32)'
const GREY_BG = 'rgb(238, 238, 238)'
const LIGHT_GREY = 'rgb(247, 247, 247)'
const BORDER_GREY = 'rgb(213, 213, 213)'

// ─── All categories with their sub‑items (mirrors BB nav) ──────────────────

// ─── All categories with their sub‑items (mirrors BB nav precisely) ───────
const CATEGORIES_DATA = [
  {
    name: 'Beauty & Hygiene',
    sub: [
      { name: 'Skin Care', items: ['Face Care', 'Body Care', 'Lip Care', 'Sunscreen', 'Anti-Ageing'] },
      { name: 'Hair Care', items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Colour', 'Hair Styling'] },
      { name: 'Bath & Body', items: ['Bathing Bars', 'Shower Gel', 'Bath Salts', 'Body Oil', 'Hand Wash'] },
      { name: 'Essential Oils', items: ['Lavender', 'Tea Tree', 'Eucalyptus', 'Peppermint'] }
    ],
  },
  {
    name: 'Snacks & Branded Foods',
    sub: [
      { name: 'Biscuits & Cookies', items: ['Cookies', 'Crackers', 'Digestive Biscuits', 'Cream Biscuits'] },
      { name: 'Chocolates & Candies', items: ['Chocolates', 'Mints & Gums', 'Candies', 'Lollipops'] },
      { name: 'Ready to Eat', items: ['Noodles', 'Pasta', 'Vermicelli', 'Breakfast Cereals'] },
      { name: 'Snacks', items: ['Chips', 'Namkeen', 'Popcorn', 'Roasted Seeds'] }
    ],
  },
  {
    name: 'Cleaning & Household',
    sub: [
      { name: 'Detergents', items: ['Detergent Powder', 'Liquid Detergent', 'Fabric Softener'] },
      { name: 'Cleaners', items: ['Floor Cleaner', 'Toilet Cleaner', 'Kitchen Cleaner', 'Glass Cleaner'] },
      { name: 'Fresheners', items: ['Air Fresheners', 'Insect Repellents', 'Pooja Needs'] }
    ],
  },
  {
    name: 'Beverages',
    sub: [
      { name: 'Tea', items: ['Leaf Tea', 'Dust Tea', 'Green Tea', 'Exotic Tea'] },
      { name: 'Coffee', items: ['Instant Coffee', 'Ground Coffee', 'Coffee Beans'] },
      { name: 'Fruit Drinks', items: ['Juices', 'Syrups', 'Concentrates', 'Soda'] }
    ],
  },
  {
    name: 'Gourmet & World Food',
    sub: [
      { name: 'Pasta & Noodle', items: ['Pasta', 'Instant Noodles', 'Vermicelli'] },
      { name: 'Oils & Vinegar', items: ['Olive Oil', 'Balsamic Vinegar', 'Apple Cider Vinegar'] },
      { name: 'Snacks', items: ['International Snacks', 'Cookies', 'Crackers'] }
    ],
  },
  {
    name: 'Eggs, Meat & Fish',
    sub: [
      { name: 'Eggs', items: ['Farm Eggs', 'Organic Eggs', 'Quail Eggs'] },
      { name: 'Fresh Chicken', items: ['Boneless', 'Curry Cut', 'Drumsticks'] },
      { name: 'Mutton', items: ['Curry Cut', 'Chops'] }
    ],
  },
  {
    name: 'Bakery, Cakes & Dairy',
    sub: [
      { name: 'Dairy', items: ['Milk', 'Curd', 'Paneer', 'Cheese', 'Butter', 'Yogurt'] },
      { name: 'Bakery', items: ['Bread', 'Buns', 'Cakes', 'Pastries', 'Muffins'] }
    ],
  },
  {
    name: 'Foodgrains, Oil & Masala',
    sub: [
      { name: 'Atta & Flours', items: ['Whole Wheat Atta', 'Maida', 'Besan', 'Sooji'] },
      { name: 'Rice & Rice Products', items: ['Basmati Rice', 'Poha', 'Raw Rice'] },
      { name: 'Oils & Ghee', items: ['Sunflower Oil', 'Mustard Oil', 'Ghee', 'Groundnut Oil'] },
      { name: 'Masalas', items: ['Whole Spices', 'Powdered Spices', 'Blended Masalas'] }
    ],
  },
  {
    name: 'Kitchen, Garden & Pets',
    sub: [
      { name: 'Kitchen Tools', items: ['Containers', 'Choppers', 'Graters', 'Cookware'] },
      { name: 'Pet Food', items: ['Dog Food', 'Cat Food', 'Pet Grooming'] }
    ],
  },
  {
    name: 'Baby Care',
    sub: [
      { name: 'Diapers', items: ['Diapers', 'Wipes'] },
      { name: 'Baby Bath', items: ['Baby Soap', 'Baby Shampoo', 'Baby Oil'] }
    ],
  },
]

const QUICK_LINKS = [
  { label: 'Skin Care', parent: 'Beauty & Hygiene', href: '#' },
  { label: 'Biscuits', parent: 'Snacks & Branded Foods', query: 'Biscuits & Cookies', href: '#' },
  { label: 'Tea', parent: 'Beverages', href: '#' },
  { label: 'Detergents', parent: 'Cleaning & Household', href: '#' },
  { label: 'Milk', parent: 'Bakery, Cakes & Dairy', query: 'Milk', href: '#' },
]

const MORE_CATEGORIES = [
  { label: 'Bath Salts', parent: 'Beauty & Hygiene' },
  { label: 'Chocolates', parent: 'Snacks & Branded Foods' },
  { label: 'Face Care', parent: 'Beauty & Hygiene' },
  { label: 'Instant Coffee', parent: 'Beverages' },
  { label: 'Hand Wash', parent: 'Cleaning & Household' },
  { label: 'Fresh Chicken', parent: 'Eggs, Meat & Fish' },
  { label: 'Cookies', parent: 'Snacks & Branded Foods' },
  { label: 'Rice', parent: 'Foodgrains, Oil & Masala' },
]

// ──────────────────────────────────────────────────────────────────────────
export default function SmallBasketHeader({
  cartCount = 0,
  onCartClick,
  onHomeClick,
  onLoginClick,
  username,
  onLogout,
  onAccountClick,
  onOrdersClick,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  activeCategory,
  onCategorySelect,
  onSubCategorySelect,
  onAddToCart,
  onUpdateQuantity,
  onSmartBasketClick,
  onWalletClick,
  onContactClick,
  walletBalance = 0,
}) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const categoriesData = CATEGORIES_DATA
  const [activeL1, setActiveL1] = useState(categoriesData[0])
  const [activeL2, setActiveL2] = useState(categoriesData[0].sub[0])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || 'Bangalore')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [suggestions, setSuggestions] = useState([])

  const getDeliveryEstimate = (loc) => {
    const map = {
      bangalore: 11,
      mumbai: 15,
      delhi: 16,
      chennai: 14,
      hyderabad: 13,
      kolkata: 17,
      pune: 13,
      ahmedabad: 16,
      gurgaon: 15,
      noida: 15,
      ludhiana: 17,
      indore: 14,
      jaipur: 15,
      lucknow: 16,
      chandigarh: 15,
      coimbatore: 13,
      kochi: 13,
      madurai: 14,
      mysore: 12,
      nagpur: 16,
      nashik: 15,
      surat: 15,
      vadodara: 15,
      vijayawada: 14,
      visakhapatnam: 14
    }
    const key = String(loc || '').trim().toLowerCase()
    const base = map[key] || 12
    const traffic = key.includes('mumbai') || key.includes('delhi') ? 2 : key.includes('kolkata') || key.includes('ahmedabad') ? 1 : 0
    return Math.max(11, base + traffic)
  }
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const categoryMenuRef = useRef(null)
  const moreMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  const toggleCategoryMenu = (e) => {
    e.stopPropagation()
    setShowCategoryMenu(!showCategoryMenu)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (!localSearchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true)
      setShowSuggestions(true)
      try {
        const response = await fetch(`${API_BASE}/products/search/${encodeURIComponent(localSearchQuery)}?limit=6`)
        const data = await response.json()
        setSuggestions(data.products || [])
      } catch (err) {
        console.error('Error fetching suggestions:', err)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [localSearchQuery])

  const toSentenceCase = (str) => {
    if (!str) return ''
    const s = String(str).trim()
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  const font = { fontFamily: "'ProximaNova', 'Montserrat', Helvetica, Arial, sans-serif" }

  const renderSearchDropdown = (isSticky = false) => {
    if (!showSuggestions || !localSearchQuery.trim()) return null

    return (
      <div 
        style={{
          position: 'absolute',
          top: isSticky ? '42px' : '38px',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          borderRadius: '0 0 4px 4px',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid #d5d5d5',
          borderTop: 'none',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
        onMouseDown={e => e.preventDefault()}
      >
        {isLoadingSuggestions ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
            Searching for '{localSearchQuery}'...
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ padding: '40px', backgroundColor: 'rgb(204, 224, 255)', justifyContent: 'center', display: 'flex', boxSizing: 'border-box' }}>
            <img 
              alt="No Search Results" 
              src="https://www.bbassets.com/bb2assets/images/png/no-search-results-found.png?tr=w-374,q-80" 
              style={{ maxWidth: '100%', height: 'auto', display: 'block', width: '374px' }} 
            />
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666' }}>
              Showing results for <b style={{ color: '#333' }}>'{localSearchQuery}'</b>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {suggestions.map(product => (
                <li 
                  key={product.id}
                  style={{
                    padding: '0px', margin: '0px', listStyle: 'outside none none', boxSizing: 'border-box',
                    borderBottom: '0.8px solid rgb(238, 238, 238)', display: 'flex', alignItems: 'center', fontSize: '12px'
                  }}
                >
                  <div style={{ width: '2.5rem', height: '40px', margin: '10px 16px', flexShrink: 0 }}>
                    <img 
                      alt="" 
                      src={product.image_url || 'https://via.placeholder.com/40'} 
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                    />
                  </div>
                  <div style={{ overflow: 'hidden', flex: '1 1 0%', display: 'flex', marginRight: '10px' }}>
                    <div 
                      onClick={() => {
                        setLocalSearchQuery('')
                        setSuggestions([])
                        setShowSuggestions(false)
                        onSearchSubmit && onSearchSubmit(product.name, product.category)
                      }}
                      style={{ cursor: 'pointer', display: 'block', width: '100%' }}
                    >
                      <span style={{ display: 'block', lineHeight: '14.25px', color: 'rgb(144, 144, 144)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {toSentenceCase(product.category || 'Brand')}
                      </span>
                      <span title={product.name} style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: '20px', color: 'rgb(32, 32, 32)', fontSize: '14px' }}>
                        {toSentenceCase(product.name)}
                      </span>
                    </div>
                  </div>
                  <span style={{ width: '4rem', color: 'rgb(144, 144, 144)', cursor: 'default', whiteSpace: 'nowrap' }}>1 kg</span>
                  <div style={{ borderLeft: '0.8px solid rgb(238, 238, 238)', height: '28px', margin: '0 10px' }}></div>
                  <div style={{ display: 'grid', gridAutoFlow: 'column', columnGap: '12px', width: '8rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'rgb(32, 32, 32)' }}>₹{product.price}</span>
                    <span style={{ fontSize: '10px', color: 'rgb(71, 111, 0)' }}>₹{(product.price * 0.1).toFixed(0)} OFF</span>
                  </div>
                  <input 
                    maxLength="4" 
                    defaultValue="1" 
                    style={{
                      width: '1.875rem', height: '30px', marginRight: '20px', borderWidth: '0.8px', borderStyle: 'solid',
                      borderColor: 'rgb(238, 238, 238)', textAlign: 'center', borderRadius: '4px', outline: 'none'
                    }} 
                  />
                  <button 
                    onClick={() => {
                      onUpdateQuantity && onUpdateQuantity(product.id, 1)
                      onAddToCart && onAddToCart(product.id)
                    }}
                    style={{
                      padding: '0 20px', fontWeight: 600, color: 'rgb(204, 0, 0)', cursor: 'pointer',
                      backgroundColor: '#fff', border: '0.8px solid rgb(204, 0, 0)', borderRadius: '4px', height: '28px',
                      fontSize: '12px', marginRight: '10px'
                    }}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            <div 
              onClick={() => { onSearchSubmit && onSearchSubmit(localSearchQuery); setShowSuggestions(false) }}
              style={{
                cursor: 'pointer', padding: '12px', textAlign: 'center', color: 'rgb(32, 32, 32)', 
                fontSize: '12px', backgroundColor: '#fff', borderTop: '1px solid #eee'
              }}
            >
              View all search results
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Container Width ───────────────────────────────────────────────────
  const containerStyle = {
    maxWidth: '1440px',
    paddingRight: '2%',
    paddingLeft: '2%',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    boxSizing: 'border-box'
  }

  const renderUserMenu = () => (
    <ul 
      role="menu" 
      ref={userMenuRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '18rem', 
        boxShadow: 'rgba(48, 48, 48, 0.04) 0px 2px 4px 0px, rgba(96, 96, 96, 0.16) 0px 8px 16px 0px', 
        padding: '0px 10px', 
        backgroundColor: 'rgb(32, 32, 32)', 
        borderRadius: '4px', 
        marginTop: '4px', 
        zIndex: 100, 
        right: '0px', 
        position: 'absolute', 
        listStyle: 'none', 
        boxSizing: 'border-box'
      }}
    >
      {[
        { label: 'My Account', onClick: () => { setShowUserMenu(false); onAccountClick && onAccountClick() } },
        { label: 'My Basket', onClick: () => { setShowUserMenu(false); onCartClick && onCartClick() }, badge: `${cartCount} items`, badgeColor: 'rgb(214, 51, 51)' },
        { label: 'My Orders', onClick: () => { setShowUserMenu(false); onOrdersClick && onOrdersClick() } },
        { label: 'My Smart Basket', onClick: () => { setShowUserMenu(false); onSmartBasketClick && onSmartBasketClick() } },
        { label: 'My Wallet', onClick: () => { setShowUserMenu(false); onWalletClick && onWalletClick() }, badge: `₹${walletBalance}`, badgeColor: 'rgb(118, 185, 0)' },
        { label: 'Contact Us', onClick: () => { setShowUserMenu(false); onContactClick && onContactClick() } },
        { label: 'Logout', onClick: () => { setShowUserMenu(false); onLogout && onLogout() }, isButton: true }
      ].map((item, idx) => (
        <li key={idx} role="menuitem" style={{ height: '36px', margin: '10px 0px' }}>
          {item.isButton ? (
            <button 
              onClick={(e) => { e.preventDefault(); item.onClick && item.onClick() }}
              style={{
                width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '14px'
              }}
            >
              <span>{item.label}</span>
            </button>
          ) : (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); item.onClick && item.onClick() }} 
              style={{
                width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 10px', textDecoration: 'none', color: '#fff', fontSize: '14px'
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  backgroundColor: item.badgeColor, padding: '4px 10px', borderRadius: '24px',
                  fontSize: '10px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap'
                }}>
                  {item.badge}
                </span>
              )}
            </a>
          )}
        </li>
      ))}
    </ul>
  )

  const renderMegaMenu = (height = '36px') => (
    showCategoryMenu && (
      <div
        ref={categoryMenuRef}
        style={{
          position: 'absolute', top: height, left: 0, marginTop: '4px', zIndex: 100,
          display: 'flex', background: '#fff', borderRadius: '8px', overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #eee'
        }}
      >
        <nav style={{ display: 'flex', fontSize: '13.2px' }}>
          {/* L1 Panel */}
          <ul style={{
            color: '#fff', padding: '10px 0', backgroundColor: '#222',
            width: '14rem', maxHeight: '480px', margin: 0, listStyle: 'none', overflowY: 'auto'
          }}>
            {categoriesData.map(cat => (
              <li key={cat.name}>
                <a
                  href="#"
                  onClick={e => { 
                    e.preventDefault(); 
                    onCategorySelect && onCategorySelect(cat.name); 
                    setShowCategoryMenu(false);
                  }}
                  onMouseEnter={() => { setActiveL1(cat); setActiveL2(cat.sub[0]) }}
                  style={{
                    display: 'flex', alignItems: 'center', height: '36px', padding: '0 15px',
                    textDecoration: 'none', color: activeL1.name === cat.name ? '#fff' : '#ccc',
                    backgroundColor: activeL1.name === cat.name ? '#444' : 'transparent',
                    fontWeight: activeL1.name === cat.name ? 600 : 400,
                  }}
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>

          {/* L2 Panel */}
          <ul style={{
            color: '#333', padding: '10px 0', backgroundColor: '#f9f9f9',
            width: '14rem', maxHeight: '480px', margin: 0, listStyle: 'none', borderRight: '1px solid #eee', overflowY: 'auto'
          }}>
            {activeL1.sub.map(sub => (
              <li key={sub.name}>
                <a
                  href="#"
                  onClick={e => { 
                    e.preventDefault(); 
                    onSubCategorySelect && onSubCategorySelect(activeL1.name, sub.name);
                    setShowCategoryMenu(false);
                  }}
                  onMouseEnter={() => setActiveL2(sub)}
                  style={{
                    display: 'flex', alignItems: 'center', height: '36px', padding: '0 15px',
                    textDecoration: 'none', color: activeL2.name === sub.name ? '#5e9400' : '#333',
                    backgroundColor: activeL2.name === sub.name ? '#fff' : 'transparent',
                    fontWeight: activeL2.name === sub.name ? 600 : 400,
                  }}
                >
                  {sub.name}
                </a>
              </li>
            ))}
          </ul>

          {/* L3 Panel */}
          <ul style={{
            color: '#333', padding: '10px 0', backgroundColor: '#fff',
            width: '16rem', maxHeight: '480px', margin: 0, listStyle: 'none', overflowY: 'auto'
          }}>
            {activeL2.items.map(item => (
              <li key={item}>
                <a
                  href="#"
                  onClick={e => { 
                    e.preventDefault(); 
                    onSubCategorySelect && onSubCategorySelect(activeL1.name, item);
                    setShowCategoryMenu(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', height: '32px', padding: '0 15px',
                    textDecoration: 'none', color: '#555', fontSize: '12px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#5e9400'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  )

  const renderQuickLink = (link) => (
    <li key={link.label} style={{ listStyle: 'none' }}>
      <a 
        href="#" 
        onClick={e => { 
          e.preventDefault(); 
          // Navigate to category without touching the search bar
          onSubCategorySelect && onSubCategorySelect(link.parent || '', link.label)
        }}
        style={{
          textDecoration: 'none', 
          color: 'rgb(32, 32, 32)', 
          fontSize: '14px', 
          fontWeight: 400,
          whiteSpace: 'nowrap',
          padding: '4px 0',
          transition: 'color 0.2s',
          display: 'block',
          lineHeight: '1',
          marginTop: '2px'
        }}
        onMouseEnter={e => { e.currentTarget.style.color = GREEN; e.currentTarget.style.textDecoration = 'underline' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgb(32, 32, 32)'; e.currentTarget.style.textDecoration = 'none' }}
      >
        {link.label}
      </a>
    </li>
  )

  // ── Scrolled (Sticky) Header ──────────────────────────────────────────
  const stickyHeader = (
    <header style={{
      opacity: isScrolled ? 1 : 0,
      boxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(48, 48, 48, 0.04) 0px 2px 4px 0px, rgba(96, 96, 96, 0.16) 0px 8px 16px 0px',
      backgroundColor: 'rgb(255, 255, 255)', justifyContent: 'center', width: '100%', display: 'flex',
      marginTop: '4px', zIndex: isScrolled ? 100 : -1, top: '0px', left: '0px', position: 'fixed',
      boxSizing: 'border-box', pointerEvents: isScrolled ? 'auto' : 'none', transition: 'opacity 0.2s',
      ...font
    }}>
      {/* Progress Bar */}
      <div style={{ position: 'fixed', top: '0px', left: '0px', width: '100%', height: '4px', backgroundColor: 'rgb(228, 241, 204)' }}>
        <div style={{ width: '100%', backgroundColor: 'rgb(94, 148, 0)', height: '4px', margin: 'auto' }}></div>
      </div>

      <div style={{ columnGap: '24px', alignItems: 'center', gridAutoFlow: 'column', display: 'grid', height: '80px' }}>
        <div style={{ columnGap: '16px', alignItems: 'center', gridAutoFlow: 'column', display: 'grid' }}>
          <button onClick={onHomeClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <img src={faviconImage} alt="SmallBasket" style={{ height: 32, width: 'auto', display: 'block' }} />
          </button>

          <div style={{ borderLeft: '0.8px solid rgb(238, 238, 238)', height: '40px' }}></div>

          {/* Category Button */}
          <div style={{ height: '40px' }}>
            <div style={{ height: '40px', position: 'relative' }}>
              <button 
                type="button" 
                onClick={toggleCategoryMenu}
                style={{
                padding: '10px', columnGap: '18px', color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(94, 148, 0)',
                borderColor: 'rgb(94, 148, 0)', borderWidth: '0.8px', borderRadius: '4px', alignContent: 'center',
                gridAutoFlow: 'column', height: '40px', display: 'grid', cursor: 'pointer', fontSize: '16px',
                fontFamily: 'inherit', borderStyle: 'solid'
              }}>
                <div style={{ columnGap: '3.008px', gridAutoFlow: 'column', lineHeight: '16px', textAlign: 'left', display: 'grid' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Shop by</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Category</span>
                </div>
                <ChevronDownSVG />
              </button>
              {renderMegaMenu('40px')}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ minWidth: '664px', height: '40px', marginTop: '8px', marginBottom: '8px' }}>
          <div style={{ height: '40px', position: 'relative' }}>
            <div style={{
              border: '0.8px solid rgb(213, 213, 213)', width: '100%', height: '40px',
              backgroundColor: 'rgb(255, 255, 255)', display: 'flex', alignItems: 'center', borderRadius: '4px'
            }}>
              <span style={{ color: 'rgb(118, 185, 0)', marginLeft: '10px', marginRight: '10px' }}>
                <SearchSVG />
              </span>
              <input
                type="text"
                placeholder="Search for Products..."
                value={localSearchQuery}
                onChange={e => setLocalSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onSearchSubmit && onSearchSubmit(localSearchQuery)
                    setShowSuggestions(false)
                  }
                }}
                style={{ fontSize: '14px', flex: '1', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearchQuery('')
                    setSuggestions([])
                    setShowSuggestions(false)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}
                >
                  <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0Zm2.5 9.5a.7.7 0 1 1-1 1L7 8.4l-1.5 1.5a.7.7 0 1 1-1-1L6 7.4l-1.5-1.5a.7.7 0 0 1 1-1L7 6.4l1.5-1.5a.7.7 0 1 1 1 1L8 7.4l1.5 1.5Z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              {renderSearchDropdown(true)}
            </div>
          </div>
        </div>

        <div style={{ borderLeft: '0.8px solid rgb(238, 238, 238)', height: '40px' }}></div>

        {/* Cart */}
        <button onClick={onCartClick} style={{
          width: '9rem', height: '40px', borderWidth: '1.6px', borderStyle: 'solid',
          color: 'rgb(32, 32, 32)', cursor: 'pointer', backgroundColor: 'rgb(250, 230, 230)',
          fontFamily: 'inherit', fontSize: '14px', borderRadius: '4px',
          borderColor: 'rgb(250, 230, 230)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px' }}><BasketSmallSVG /></span>
          <span style={{ fontWeight: 600 }}>{cartCount} Items</span>
        </button>
      </div>
    </header>
  )

  // ── Normal Header ───────────────────────────────────────────────────────
  return (
    <>
      {stickyHeader}
      <header style={{
        opacity: isScrolled ? 0 : 1, display: 'flex', flexDirection: 'column',
        zIndex: 30, boxSizing: 'border-box', ...font, pointerEvents: isScrolled ? 'none' : 'auto',
      }}>
        {/* ROW 1 */}
        <div style={{ 
          ...containerStyle, columnGap: '24px', gridAutoFlow: 'column', height: 'auto', 
          display: 'flex', flexWrap: 'wrap', marginTop: '14px', marginBottom: '10px',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ columnGap: '24px', display: 'flex', alignItems: 'center', flex: 1, minWidth: '300px' }}>
            <button onClick={onHomeClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <img src={logoImage} alt="SmallBasket" style={{ height: 36, width: 'auto' }} />
            </button>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ height: '36px', position: 'relative' }}>
                <div style={{
                  border: '0.8px solid rgb(213, 213, 213)', width: '100%', height: '36px',
                  backgroundColor: 'rgb(255, 255, 255)', display: 'flex', alignItems: 'center', borderRadius: '4px'
                }}>
                  <span style={{ color: 'rgb(118, 185, 0)', marginLeft: '10px', marginRight: '10px' }}>
                    <SearchSVG />
                  </span>
                  <input
                    type="text"
                    placeholder="Search for Products..."
                    value={localSearchQuery}
                    onChange={e => setLocalSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        onSearchSubmit && onSearchSubmit(localSearchQuery)
                        setShowSuggestions(false)
                      }
                    }}
                    style={{ fontSize: '14px', flex: '1', border: 'none', outline: 'none', fontFamily: 'inherit' }}
                  />
                  {localSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearchQuery('')
                        setSuggestions([])
                        setShowSuggestions(false)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999'
                      }}
                    >
                      <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0Zm2.5 9.5a.7.7 0 1 1-1 1L7 8.4l-1.5 1.5a.7.7 0 1 1-1-1L6 7.4l-1.5-1.5a.7.7 0 0 1 1-1L7 6.4l1.5-1.5a.7.7 0 1 1 1 1L8 7.4l1.5 1.5Z" fill="currentColor"/>
                      </svg>
                    </button>
                  )}
                  {renderSearchDropdown(false)}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ columnGap: '24px', display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            {/* Location */}
            <div style={{ width: '10.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowLocationModal(true)}
                style={{
                  padding: '4px 8px 0px', lineHeight: '16px', color: 'rgb(96, 96, 96)', cursor: 'pointer',
                  backgroundColor: 'rgb(238, 238, 238)', border: 'none', borderRadius: '4px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '100%', height: '36px',
                  fontFamily: 'inherit', textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <ZapSVG />
                  <span style={{ color: 'rgb(94, 148, 0)', fontWeight: 700, fontSize: '12px', marginLeft: '4px' }}>Delivery in {getDeliveryEstimate(location)} mins</span>
                </span>
                <span style={{ color: 'rgb(64, 64, 64)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {location}
                </span>
              </button>
            </div>

            <div style={{ columnGap: '10px', gridAutoFlow: 'column', display: 'grid' }}>
              {username ? (
                <div style={{ position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu) }}
                    style={{
                      padding: '6px 18px', background: 'rgb(238, 238, 238)', color: 'rgb(0, 0, 0)',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <AvatarSVG />
                  </button>
                  {showUserMenu && renderUserMenu()}
                </div>
              ) : (
                <button type="button" onClick={onLoginClick} style={{
                  padding: '12px 24px', background: 'rgb(32, 32, 32)', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 600, height: '36px'
                }}>
                  Login/ Sign Up
                </button>
              )}

              {/* Cart Button */}
              <div onClick={onCartClick} style={{
                backgroundColor: 'rgb(250, 230, 230)', borderRadius: '4px', cursor: 'pointer',
                width: '2.25rem', height: '36px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BasketSVG />
                <span style={{
                  position: 'absolute', bottom: '0px', right: '0px', background: 'rgb(0, 0, 0)',
                  color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                  padding: '1px 4px', marginBottom: '2px', marginRight: '1px', boxShadow: '0 0.5px 2px rgba(96,96,96,0.16)'
                }}>
                  {cartCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div style={{ ...containerStyle, paddingTop: '4px', paddingBottom: '4px', columnGap: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', height: '36px' }}>
            <button 
              type="button" 
              onClick={toggleCategoryMenu}
              style={{
              padding: '10px', columnGap: '18px', color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(94, 148, 0)',
              borderColor: 'rgb(94, 148, 0)', borderWidth: '0.8px', borderRadius: '4px', alignContent: 'center',
              gridAutoFlow: 'column', height: '36px', display: 'grid', cursor: 'pointer', fontSize: '16px',
              fontFamily: 'inherit', borderStyle: 'solid'
            }}>
              <div style={{ columnGap: '3.008px', gridAutoFlow: 'column', lineHeight: '16px', textAlign: 'left', display: 'grid' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Shop by</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Category</span>
              </div>
              <ChevronDownSVG />
            </button>
            {renderMegaMenu('36px')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', columnGap: '20px', flex: 1, height: '36px' }}>
            <ul style={{ display: 'flex', columnGap: '24px', padding: 0, margin: 0, listStyle: 'none', alignItems: 'center', height: '100%' }}>
              {QUICK_LINKS.map(renderQuickLink)}
            </ul>
            <div style={{ position: 'relative' }} ref={moreMenuRef}>
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', height: '38.6px', color: showMoreMenu ? 'rgb(204, 0, 0)' : 'inherit' }}
              >
                <MoreSVG />
              </button>
              {showMoreMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, backgroundColor: '#fff',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)', borderRadius: '4px', zIndex: 100,
                  minWidth: '160px', padding: '8px 0', border: '1px solid #eee'
                }}>
                  {MORE_CATEGORIES.map(cat => (
                    <div
                      key={cat.label}
                      onClick={(e) => { 
                        e.stopPropagation();
                        onSubCategorySelect && onSubCategorySelect(cat.parent || 'All', cat.label); 
                        setShowMoreMenu(false);
                      }}
                      style={{
                        padding: '8px 16px', fontSize: '14px', color: '#333', cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderRight: '0.8px solid rgb(238, 238, 238)', height: '24px', alignSelf: 'center' }}></div>
          </div>
        </div>

        {/* Shadow Background placeholder */}
        <div style={{ paddingBottom: '110px', backgroundColor: '#fff', width: '100%', position: 'absolute', top: 0, zIndex: -1, boxShadow: '0 8px 16px rgba(96,96,96,0.16)' }}>
          <div style={{ height: '4px', backgroundColor: 'rgb(228, 241, 204)' }}>
            <div style={{ width: '100%', backgroundColor: 'rgb(94, 148, 0)', height: '4px' }}></div>
          </div>
        </div>
      </header>
      {showLocationModal && (
        <LocationModal 
          onClose={() => setShowLocationModal(false)} 
          onSelect={(city) => {
            setLocation(city)
            localStorage.setItem('userLocation', city)
            setShowLocationModal(false)
          }}
        />
      )}
    </>
  )
}

function LocationModal({ onClose, onSelect }) {
  const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 
    'Ahmedabad', 'Gurgaon', 'Noida', 'Ludhiana', 'Indore', 'Jaipur', 'Lucknow',
    'Chandigarh', 'Coimbatore', 'Kochi', 'Madurai', 'Mysore', 'Nagpur', 'Nashik',
    'Surat', 'Vadodara', 'Vijayawada', 'Visakhapatnam'
  ]
  const [search, setSearch] = useState('')
  const filteredCities = cities.filter(city => city.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', width: '400px', borderRadius: '12px',
        overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Select Delivery Location</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>
          <input 
            type="text" 
            placeholder="Search city..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '10px', borderRadius: '6px',
              border: '1px solid #ddd', marginBottom: '20px', outline: 'none'
            }}
          />
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredCities.map(city => (
              <div 
                key={city}
                onClick={() => onSelect(city)}
                style={{
                  padding: '12px', borderBottom: '1px solid #f9f9f9',
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={e => e.target.style.backgroundColor = '#fff'}
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Inline SVG Icons from Reference ──────────────────────────────────────

function SearchSVG() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ display: 'block' }}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ZapSVG() {
  return (
    <svg width="7" height="10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M2.014 6.417H.351a.327.327 0 0 1-.308-.186.317.317 0 0 1 .03-.36L4.002.194a.466.466 0 0 1 .232-.174.386.386 0 0 1 .28.011.47.47 0 0 1 .22.186.392.392 0 0 1 .059.28L4.34 4.09h2.047c.147 0 .252.066.314.198a.33.33 0 0 1-.047.372L2.34 9.836a.424.424 0 0 1-.239.15.411.411 0 0 1-.273-.022.449.449 0 0 1-.203-.186.41.41 0 0 1-.053-.28l.442-3.081Z" fill="#5E9400" />
    </svg>
  )
}

function BasketSVG() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="24" height="24" rx="12" fill="#D63333" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M16.795 10.2H18.3c.385 0 .7.315.7.7 0 .385-.315.7-.7.7H5.7a.702.702 0 0 1-.7-.7c0-.385.315-.7.7-.7h1.505l.998-3.01A1.75 1.75 0 0 1 9.864 6h4.27c.752 0 1.435.473 1.662 1.19l.998 3.01ZM8.867 7.418 7.94 10.2h8.12l-.91-2.782a1.035 1.035 0 0 0-.998-.718H9.866c-.455 0-.857.28-.998.718ZM6.05 16.85V12.3h11.9v4.55c0 .962-.787 1.75-1.75 1.75H7.8c-.962 0-1.75-.788-1.75-1.75Zm3.465.367c.157 0 .297-.14.297-.314v-2.888c0-.175-.122-.315-.297-.315a.314.314 0 0 0-.315.315v2.887c0 .175.14.316.315.316Zm2.485 0c.175 0 .315-.14.315-.314v-2.888A.314.314 0 0 0 12 13.7a.314.314 0 0 0-.315.315v2.887c0 .175.14.316.315.316Zm2.485 0c.175 0 .315-.14.315-.314v-2.888a.314.314 0 0 0-.315-.315c-.157 0-.297.14-.297.315v2.887c0 .175.122.316.297.316Z"
        fill="#fff"
      />
    </svg>
  )
}

function ChevronDownSVG() {
  return (
    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', placeSelf: 'center' }}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M8 11.333c-.338 0-.66-.155-.884-.428l-2.81-3.398a1.39 1.39 0 0 1-.172-1.474c.204-.432.608-.7 1.057-.7h5.617c.449 0 .854.268 1.057.7a1.39 1.39 0 0 1-.172 1.473l-2.81 3.4a1.146 1.146 0 0 1-.883.427Z"
        fill="#fff"
      />
    </svg>
  )
}

function MoreSVG() {
  return (
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" style={{ display: 'block' }}>
      <path fillRule="evenodd" clipRule="evenodd" d="m9.3 3.582 3.22 4c.199.247.196.6-.008.845l-3.333 4a.666.666 0 1 1-1.024-.854l2.984-3.58-2.877-3.575A.666.666 0 1 1 9.3 3.582ZM3.698 3.48a.667.667 0 0 1 .937.101l3.219 4c.198.247.196.6-.008.845l-3.333 4a.666.666 0 1 1-1.024-.854l2.983-3.58-2.876-3.575a.667.667 0 0 1 .102-.937Z" fill="currentColor" />
    </svg>
  )
}

function BasketSmallSVG() {
  return (
    <svg width="26" height="26" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M.5 12c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12Z" fill="#D63333" />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.295 10.2H18.8c.385 0 .7.315.7.7 0 .385-.315.7-.7.7H6.2a.702.702 0 0 1-.7-.7c0-.385.315-.7.7-.7h1.505l.998-3.01A1.75 1.75 0 0 1 10.364 6h4.27c.752 0 1.435.473 1.662 1.19l.998 3.01ZM9.367 7.418 8.44 10.2h8.12l-.91-2.782a1.035 1.035 0 0 0-.998-.718h-4.287c-.455 0-.857.28-.998.718ZM6.55 16.85V12.3h11.9v4.55c0 .962-.787 1.75-1.75 1.75H8.3c-.963 0-1.75-.788-1.75-1.75Zm3.465.367c.157 0 .297-.14.297-.314v-2.888c0-.175-.122-.315-.297-.315a.314.314 0 0 0-.315.315v2.887c0 .175.14.316.315.316Zm2.485 0c.175 0 .315-.14.315-.314v-2.888a.314.314 0 0 0-.315-.315.314.314 0 0 0-.315.315v2.887c0 .175.14.316.315.316Zm2.485 0c.175 0 .315-.14.315-.314v-2.888a.314.314 0 0 0-.315-.315c-.157 0-.297.14-.297.315v2.887c0 .175.122.316.297.316Z" fill="#fff" />
    </svg>
  )
}

function AvatarSVG() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="24" height="24" rx="12" fill="#202020" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.635 8.857a2.86 2.86 0 0 1-2.857 2.857 2.86 2.86 0 0 1-2.857-2.857A2.86 2.86 0 0 1 11.778 6a2.86 2.86 0 0 1 2.857 2.857Zm2.147 9.287c0 .394-.32.714-.714.714H7.497a.714.714 0 0 1-.715-.714c0-2.758 2.244-5 5-5 2.757 0 5 2.242 5 5Z" fill="#fff" />
    </svg>
  )
}
