import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import './SmallBasket.css'
import SmallBasketHeader from './components/SmallBasketHeader'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import Recommendations from './components/Recommendations'
import BrowsingHistory from './components/BrowsingHistory'
import LoadingScreen from './components/LoadingScreen'
import LoginSignup from './components/LoginSignup'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import Toast from './components/Toast'
import SearchResults from './components/SearchResults'
import ProductDetail from './components/ProductDetail'
import Account from './components/Account'
import Wallet from './components/Wallet'
import SmartBasket from './components/SmartBasket'
import ContactUs from './components/ContactUs'
import MyOrders from './components/MyOrders'
import OrderDetails from './components/OrderDetails'
import Addresses from './components/Addresses'
import EmailSettings from './components/EmailSettings'
import AdminDashboard from './components/AdminDashboard'
import RecommendationInfoModal from './components/RecommendationInfoModal'
import CheckoutPage from './components/CheckoutPage'
import PaymentPage from './components/PaymentPage'
import Footer from './components/Footer'
import TopLoader from './components/TopLoader'
import { API_BASE } from './config'

const BOOT_DELAY_MS = 1400
const ITEMS_PER_PAGE = 25

const BIGBASKET_CATEGORIES = [
  'Beauty & Hygiene',
  'Snacks & Branded Foods',
  'Cleaning & Household',
  'Beverages',
  'Gourmet & World Food',
  'Eggs, Meat & Fish',
  'Bakery, Cakes & Dairy',
  'Foodgrains, Oil & Masala',
  'Kitchen, Garden & Pets',
  'Baby Care'
]

const DISPLAY_TO_DB_CATEGORY = {
  'Beauty & Hygiene': 'beauty  hygiene',
  'Snacks & Branded Foods': 'snacks  branded foods',
  'Cleaning & Household': 'cleaning  household',
  'Beverages': 'beverages',
  'Gourmet & World Food': 'gourmet  world food',
  'Eggs, Meat & Fish': 'eggs meat  fish',
  'Bakery, Cakes & Dairy': 'bakery cakes  dairy',
  'Foodgrains, Oil & Masala': 'foodgrains oil  masala',
  'Kitchen, Garden & Pets': 'kitchen garden  pets',
  'Baby Care': 'baby care'
}

function App() {
  const locationPath = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState('home')
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [userData, setUserData] = useState(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [skip, setSkip] = useState(0)
  const [cart, setCart] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [recommendationGroups, setRecommendationGroups] = useState({})
  const [browsingHistory, setBrowsingHistory] = useState([])
  const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || [])
  const [purchases, setPurchases] = useState(JSON.parse(localStorage.getItem('purchases')) || [])
  const [orders, setOrders] = useState([])
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false)
  const [deliveryAddresses, setDeliveryAddresses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('deliveryAddresses') || 'null')
      if (Array.isArray(saved) && saved.length > 0) return saved
    } catch (err) {
      // ignore malformed stored data
    }
    return [
      {
        id: 'home',
        label: 'Home',
        title: 'Residential Township',
        address: 'Residential Township, Delhi Cantonment, New Delhi, Delhi, 110010',
        details: 'Preferred delivery location'
      },
      {
        id: 'office',
        label: 'Office',
        title: 'Office Campus',
        address: 'A-12, Tech Park, New Delhi, Delhi, 110045',
        details: 'Weekday delivery only'
      }
    ]
  })
  const [selectedDeliveryAddressId, setSelectedDeliveryAddressId] = useState(() => {
    return localStorage.getItem('selectedDeliveryAddressId') || ''
  })
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState(() => {
    return localStorage.getItem('selectedDeliverySlot') || ''
  })
  const selectedDeliveryAddress = useMemo(
    () => deliveryAddresses.find((address) => address.id === selectedDeliveryAddressId),
    [deliveryAddresses, selectedDeliveryAddressId]
  )
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [bootLoading, setBootLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(!sessionStorage.getItem('appLoaded'))
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [savedItems, setSavedItems] = useState(JSON.parse(localStorage.getItem('savedItems')) || [])
  const [cartItemQuantities, setCartItemQuantities] = useState({})
  const [dismissedCheckoutRecommendationIds, setDismissedCheckoutRecommendationIds] = useState([])
  const [toasts, setToasts] = useState([])
  const [breadcrumbCategory, setBreadcrumbCategory] = useState('')
  const [recInfoModal, setRecInfoModal] = useState(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  // Keep cartItemQuantities in sync with loaded cart
  useEffect(() => {
    const newQuantities = {}
    cart.forEach((item) => {
      newQuantities[item.product_id] = item.quantity
    })
    setCartItemQuantities(newQuantities)
  }, [cart])

  // Trigger loading animation on route change
  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 800)
    return () => clearTimeout(timer)
  }, [locationPath.pathname, activeCategory, searchQuery, subCategoryFilter])

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    let isMounted = true

    const initializeApp = async () => {
      try {
        await Promise.all([
          loadProducts(),
          new Promise((resolve) => setTimeout(resolve, BOOT_DELAY_MS))
        ])
      } finally {
        if (isMounted) {
          setBootLoading(false)
          sessionStorage.setItem('appLoaded', 'true')
        }
      }
    }

    initializeApp()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadCart()
      loadRecommendations()
      loadAllRecommendationGroups()
      loadBrowsingHistory()
      loadOrders()
      loadUserData()
    }
    // always load client-side persisted search history and purchases
    setSearchHistory(JSON.parse(localStorage.getItem('searchHistory')) || [])
    setPurchases(JSON.parse(localStorage.getItem('purchases')) || [])
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    setUserId(null)
    setUsername(null)
    setCart([])
    setOrders([])
    setRecommendations([])
    setBrowsingHistory([])
    setUserData(null)
    setCurrentPage('home')
    navigate('/')
    showToast('Logged out successfully. See you soon!', 'success')
  }

  const loadProducts = async (currentSkip = 0, isAppend = false, overrideCategory, overrideSearch, overrideSubFilter) => {
    try {
      const catToUse = overrideCategory !== undefined ? overrideCategory : activeCategory
      const searchToUse = overrideSearch !== undefined ? overrideSearch : searchQuery
      const subToUse = overrideSubFilter !== undefined ? overrideSubFilter : subCategoryFilter
      const params = new URLSearchParams({
        skip: currentSkip,
        limit: ITEMS_PER_PAGE,
        category: DISPLAY_TO_DB_CATEGORY[catToUse] || catToUse,
        search: searchToUse || subToUse
      })
      const response = await fetch(`${API_BASE}/products?${params.toString()}`)
      const data = await response.json()
      // Map backend product categories to BigBasket-like canonical categories
      const mapCategory = (raw, pObj) => {
        // Name-based overrides for commonly miscategorized items
        if (pObj && pObj.name) {
          const nameLower = pObj.name.toLowerCase()
          if (nameLower.includes('hair dry') || nameLower.includes('trimmer') || nameLower.includes('shaver') || nameLower.includes('straightener')) {
            return 'Beauty & Hygiene'
          }
        }

        if (!raw) return 'Others'
        const s = String(raw).toLowerCase()
        
        // Exact matches for database strings (with double spaces)
        if (s === 'beauty  hygiene') return 'Beauty & Hygiene'
        if (s === 'snacks  branded foods') return 'Snacks & Branded Foods'
        if (s === 'cleaning  household') return 'Cleaning & Household'
        if (s === 'beverages') return 'Beverages'
        if (s === 'gourmet  world food') return 'Gourmet & World Food'
        if (s === 'eggs meat  fish') return 'Eggs, Meat & Fish'
        if (s === 'bakery cakes  dairy') return 'Bakery, Cakes & Dairy'
        if (s === 'foodgrains oil  masala') return 'Foodgrains, Oil & Masala'
        if (s === 'kitchen garden  pets') return 'Kitchen, Garden & Pets'
        if (s === 'baby care') return 'Baby Care'

        // Fallbacks
        if (s.includes('fruit') || s.includes('veg')) return 'Fruits & Vegetables'
        if (s.includes('oil') || s.includes('atta') || s.includes('masala')) return 'Foodgrains, Oil & Masala'
        if (s.includes('milk') || s.includes('dairy')) return 'Bakery, Cakes & Dairy'
        if (s.includes('tea') || s.includes('coffee')) return 'Beverages'
        if (s.includes('snack') || s.includes('biscuit')) return 'Snacks & Branded Foods'
        if (s.includes('beauty') || s.includes('hygiene') || s.includes('personal care')) return 'Beauty & Hygiene'
        if (s.includes('clean') || s.includes('household')) return 'Cleaning & Household'
        if (s.includes('kitchen') || s.includes('garden') || s.includes('home')) return 'Kitchen, Garden & Pets'
        if (s.includes('egg') || s.includes('meat')) return 'Eggs, Meat & Fish'
        if (s.includes('baby')) return 'Baby Care'
        if (s.includes('electronics') || s.includes('appliance')) return 'Kitchen, Garden & Pets'
        return 'Others'
      }

      if (Array.isArray(data.products)) {
        data.products = data.products.map((p) => {
          let rating = null;
          let reviewsCount = 0;
          let reviews = [];
          let isHarDinSasta = false;
          let discount = 0;
          let mrp;

          if (p.id % 5 === 0) {
            rating = (4.0 + (p.id % 10) / 10).toFixed(1);
            reviewsCount = 120 + (p.id % 50);
            reviews = [
              { user: 'Rahul K.', rating: 5, date: '2 days ago', comment: 'Great quality, delivered fresh and on time. Highly recommend!' },
              { user: 'Priya S.', rating: 4, date: '1 week ago', comment: 'Good product. Pricing is fair.' }
            ];
            isHarDinSasta = true;
            discount = 15 + (p.id % 10);
            mrp = Math.round(p.price / (1 - discount / 100));
          } else if (p.id % 3 === 0) {
            rating = (3.5 + (p.id % 10) / 10).toFixed(1);
            reviewsCount = 45 + (p.id % 30);
            reviews = [
              { user: 'Amit S.', rating: 4, date: '3 days ago', comment: 'Standard quality.' }
            ];
            discount = 5 + (p.id % 5);
            mrp = Math.round(p.price / (1 - discount / 100));
          }

          return {
            ...p,
            rating,
            reviewsCount,
            reviews,
            isHarDinSasta,
            discount,
            mrp,
            category: mapCategory(p.category || p.subcategory || p.type, p)
          }
        })
      }
      
      if (isAppend) {
        setProducts(prev => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }
      setTotalProducts(data.total)
      return data
    } catch (error) {
      console.error('Error loading products:', error)
      if (!isAppend) setProducts([])
      return []
    }
  }

  // Reload products when category or search changes
  useEffect(() => {
    if (!bootLoading) {
      setSkip(0)
      loadProducts(0, false, activeCategory, searchQuery, subCategoryFilter)
    }
  }, [activeCategory, searchQuery, subCategoryFilter])

  const loadCart = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/cart`)
      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const loadRecommendations = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/recommendations`)
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const loadAllRecommendationGroups = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/recommendations/all`)
      const data = await response.json()
      setRecommendationGroups(data)
    } catch (error) {
      console.error('Error loading recommendation groups:', error)
    }
  }

  const recordSearchActivity = async (query) => {
    if (!query || !query.trim()) return
    const item = { query: String(query).trim(), ts: Date.now() }
    const next = [item, ...searchHistory].slice(0, 30)
    setSearchHistory(next)
    localStorage.setItem('searchHistory', JSON.stringify(next))
    // Local history is already updated above. 
    // The search-history endpoint is currently disabled to avoid console noise.
    if (userId && false) { 
      try {
        const res = await fetch(`${API_BASE}/users/${userId}/search-history`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        if (res.ok) {
          loadRecommendations()
        }
      } catch (err) {
        // Silently handle if history service is unavailable
      }
    }
    // Still refresh recommendations locally if possible
    loadRecommendations()
  }

  const recordPurchases = async (items) => {
    if (!items || items.length === 0) return
    // items: array of { productId, quantity } or product objects
    const ids = items.map(i => (i.productId || i.id || i))
    const next = Array.from(new Set([...ids, ...purchases])).slice(0, 200)
    setPurchases(next)
    localStorage.setItem('purchases', JSON.stringify(next))
    if (userId) {
      try {
        await fetch(`${API_BASE}/users/${userId}/purchases`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: ids, ts: Date.now() })
        })
        loadRecommendations()
      } catch (err) {
        console.error('Error recording purchases', err)
      }
    }
  }

  const loadBrowsingHistory = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/browsing-history`)
      const data = await response.json()
      setBrowsingHistory(data)
    } catch (error) {
      console.error('Error loading browsing history:', error)
    }
  }

  const loadOrders = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/orders`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadUserData = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`)
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleUpdateUser = async (update) => {
    if (!userId) return false
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
      if (!response.ok) throw new Error('Update failed')
      const data = await response.json()
      setUserData(data)
      setUsername(data.username)
      showToast('Profile updated successfully', 'success')
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      showToast('Failed to update profile', 'error')
      return false
    }
  }

  const addWalletMoney = (amount) => {
    setWalletBalance(prev => prev + amount)
    showToast(`₹${amount} added to your wallet!`, 'success')
  }

  const trackProduct = async (productId) => {
    if (!userId) return
    try {
      // Track both browsing history and click
      await Promise.all([
        fetch(`${API_BASE}/users/${userId}/browsing-history/${productId}`, {
          method: 'POST'
        }),
        fetch(`${API_BASE}/users/${userId}/track-click/${productId}`, {
          method: 'POST'
        })
      ])
      loadBrowsingHistory()
      loadRecommendations()
    } catch (error) {
      console.error('Error tracking product:', error)
    }
  }

  const addToCart = async (productId) => {
    if (!userId) {
      try {
        const response = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: `guest_${Date.now()}`,
            email: `guest_${Date.now()}@example.com`
          })
        })
        const user = await response.json()
        setUserId(user.id)
        localStorage.setItem('userId', user.id)

        await fetch(`${API_BASE}/users/${user.id}/cart/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: 1 })
        })

        showToast('An item has been added to your basket successfully', 'success')
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
      return
    }

    try {
      await fetch(`${API_BASE}/users/${userId}/cart/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 })
      })
      loadCart()
      showToast('An item has been added to your basket successfully', 'success')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const updateCartQuantity = async (productId, newQuantity) => {
    if (!userId) return
    try {
      await fetch(`${API_BASE}/users/${userId}/cart/${productId}?quantity=${newQuantity}`, {
        method: 'PUT'
      })
      loadCart()
    } catch (error) {
      console.error('Error updating cart quantity:', error)
    }
  }

  const removeFromCart = async (productId) => {
    if (!userId) return
    try {
      await fetch(`${API_BASE}/users/${userId}/cart/${productId}`, {
        method: 'DELETE'
      })
      loadCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const saveForLater = async (productId) => {
    const itemToSave = cart.find(item => item.product_id === productId)
    if (itemToSave) {
      const newSavedItems = [...savedItems, itemToSave.product]
      setSavedItems(newSavedItems)
      localStorage.setItem('savedItems', JSON.stringify(newSavedItems))
      await removeFromCart(productId)
      showToast('Item saved for later', 'success')
    }
  }

  const moveToCart = async (productId) => {
    const itemToMove = savedItems.find(item => item.id === productId)
    if (itemToMove) {
      const newSavedItems = savedItems.filter(item => item.id !== productId)
      setSavedItems(newSavedItems)
      localStorage.setItem('savedItems', JSON.stringify(newSavedItems))
      await addToCart(productId)
      showToast('Item moved to basket', 'success')
    }
  }

  const checkout = async () => {
    if (!userId || !username) {
      setShowLoginModal(true)
      return
    }
    navigate('/checkout')
  }

  const persistDeliveryState = (addressId, slot) => {
    if (addressId) localStorage.setItem('selectedDeliveryAddressId', addressId)
    if (slot) localStorage.setItem('selectedDeliverySlot', slot)
  }

  const placeOrder = async (paymentMethod = null) => {
    setCheckoutLoading(true)
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: paymentMethod })
      })
      const order = await response.json()
      if (!response.ok) {
        throw new Error(order.detail || 'Unable to place order')
      }
      showToast('Order placed successfully!', 'success')
      const purchasedItems = cart.map(ci => ({ productId: ci.product_id || ci.product?.id || ci.id, quantity: ci.quantity || 1 }))
      recordPurchases(purchasedItems)
      setCart([])
      loadCart()
      loadOrders()
      setDeliveryModalOpen(false)
      return true
    } catch (error) {
      showToast('Error placing order: ' + (error.message || 'Please try again'), 'error')
      return false
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleConfirmDelivery = async () => {
    if (!selectedDeliveryAddressId) {
      showToast('Please select a delivery address before proceeding.', 'error')
      return
    }
    if (!selectedDeliverySlot) {
      showToast('Please select a delivery slot before proceeding.', 'error')
      return
    }
    persistDeliveryState(selectedDeliveryAddressId, selectedDeliverySlot)
    setDeliveryModalOpen(false)
    navigate('/payment')
  }

  const handleCompletePayment = async (paymentMethod = null) => {
    const success = await placeOrder(paymentMethod)
    if (success) {
      navigate('/orders')
    }
  }

  const addDeliveryAddress = (address) => {
    const updated = [address, ...deliveryAddresses]
    setDeliveryAddresses(updated)
    localStorage.setItem('deliveryAddresses', JSON.stringify(updated))
    setSelectedDeliveryAddressId(address.id)
    persistDeliveryState(address.id, selectedDeliverySlot)
  }

  const removeDeliveryAddress = (addressId) => {
    const updated = deliveryAddresses.filter((address) => address.id !== addressId)
    setDeliveryAddresses(updated)
    localStorage.setItem('deliveryAddresses', JSON.stringify(updated))
    if (selectedDeliveryAddressId === addressId) {
      setSelectedDeliveryAddressId('')
      localStorage.removeItem('selectedDeliveryAddressId')
    }
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not available in your browser.', 'error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const address = {
          id: `gps-${Date.now()}`,
          label: 'Current location',
          title: 'Live location',
          address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          details: 'Location captured from device GPS'
        }
        addDeliveryAddress(address)
      },
      () => {
        showToast('Unable to access your location. Please choose an address manually.', 'error')
      }
    )
  }

  const handleSearchSubmit = (query, categoryOverride) => {
    if (typeof query === 'string') {
      setSearchQuery(query)
      setSubCategoryFilter('')
      if (categoryOverride !== undefined) {
        setActiveCategory(categoryOverride || 'All')
        setBreadcrumbCategory(categoryOverride || '')
      } else {
        setActiveCategory('All')
        setBreadcrumbCategory('')
      }
    }
    setSkip(0)
    loadProducts(0, false, categoryOverride || 'All', (typeof query === 'string' ? query : searchQuery), '')
    navigate('/')
    recordSearchActivity(query || searchQuery)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSubCategoryFilter('')
    setActiveCategory('All')
    setBreadcrumbCategory('')
    setSkip(0)
    loadProducts(0, false, 'All', '', '')
    navigate('/')
  }

  const handleCategorySelect = (category) => {
    setActiveCategory(category)
    setBreadcrumbCategory(category === 'All' ? '' : category)
    setSearchQuery('')          // clear search bar when navigating by category
    setSubCategoryFilter('')
    setSkip(0)
    loadProducts(0, false, category, '', '')
    navigate('/')
    window.scrollTo(0, 0)
  }

  // Called from header quick-links / mega-menu: sets category + sub-label without touching search bar
  const handleSubCategorySelect = (parentCategory, subLabel) => {
    setActiveCategory(parentCategory || 'All')
    setBreadcrumbCategory(subLabel || parentCategory || '')
    setSubCategoryFilter(subLabel || '')
    setSearchQuery('')          // keep search bar empty
    setSkip(0)
    loadProducts(0, false, parentCategory || 'All', '', subLabel || '')
    navigate('/')
    window.scrollTo(0, 0)
  }

  const toggleSaveItem = (productId, productFallback = null) => {
    const product = productFallback || products.find(p => p.id === productId) || recommendations.find(p => p.id === productId) || browsingHistory.find(p => p.id === productId)
    if (!product) return

    setSavedItems((prev) => {
      const isAlreadySaved = prev.some(item => item.id === productId)
      let updated
      if (isAlreadySaved) {
        updated = prev.filter(item => item.id !== productId)
        showToast('Item removed from saved items', 'info')
      } else {
        updated = [...prev, product]
        showToast('Item saved for later!', 'success')
      }
      localStorage.setItem('savedItems', JSON.stringify(updated))
      return updated
    })
  }

  const isSaved = (productId) => savedItems.some(item => item.id === productId)

  const dismissCheckoutRecommendation = (productId) => {
    setDismissedCheckoutRecommendationIds((prev) => (
      prev.includes(productId) ? prev : [...prev, productId]
    ))
  }

  const handleOpenProduct = (productId) => {
    trackProduct(productId)
    const product = products.find(p => p.id === productId) || recommendations.find(p => p.id === productId) || browsingHistory.find(p => p.id === productId) || { category: 'product' }
    const categorySlug = String(product.category || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    window.open(`/${categorySlug}/${productId}`, '_blank')
  }

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity > 12) {
      showToast('You cannot add more than 12 quantities of this product', 'error')
      return
    }
    if (quantity < 0) return

    // Optimistically update local state first
    setCartItemQuantities((prev) => ({ ...prev, [productId]: quantity }))

    if (!userId) {
      // If no user, we can register guest user
      try {
        const response = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: `guest_${Date.now()}`,
            email: `guest_${Date.now()}@example.com`
          })
        })
        const user = await response.json()
        setUserId(user.id)
        localStorage.setItem('userId', user.id)

        // Then update cart on backend
        await fetch(`${API_BASE}/users/${user.id}/cart/${productId}?quantity=${quantity}`, {
          method: 'PUT'
        })
        loadCart()
      } catch (error) {
        console.error('Error updating cart:', error)
      }
      return
    }

    try {
      // Backend expects PUT /api/users/{user_id}/cart/{product_id}?quantity={quantity}
      const response = await fetch(`${API_BASE}/users/${userId}/cart/${productId}?quantity=${quantity}`, {
        method: 'PUT'
      })
      if (response.ok) {
        loadCart()
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
    }
  }

  const addToCartWithQuantity = async (productId) => {
    const quantity = cartItemQuantities[productId] || 1

    if (!userId) {
      try {
        const response = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: `guest_${Date.now()}`,
            email: `guest_${Date.now()}@example.com`
          })
        })
        const user = await response.json()
        setUserId(user.id)
        localStorage.setItem('userId', user.id)

        await fetch(`${API_BASE}/users/${user.id}/cart/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity })
        })
        setSelectedProduct(null)
        setCartItemQuantities((prev) => ({ ...prev, [productId]: 1 }))
        loadCart()
        showToast('An item has been added to your basket successfully', 'success')
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
      return
    }

    try {
      await fetch(`${API_BASE}/users/${userId}/cart/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      setSelectedProduct(null)
      setCartItemQuantities((prev) => ({ ...prev, [productId]: 1 }))
      loadCart()
      showToast('An item has been added to your basket successfully', 'success')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }
  const loadMoreProducts = () => {
    const nextSkip = skip + ITEMS_PER_PAGE
    setSkip(nextSkip)
    loadProducts(nextSkip, true)
  }

  const filteredRecommendations = recommendations.map(p => ({...p, explanation: p.recommendation_reason || 'AI-curated pick based on your unique profile'}))
  const checkoutRecommendations = recommendations.filter((product) => !dismissedCheckoutRecommendationIds.includes(product.id))

  // Use backend recommendation groups
  const recsFromPurchases = recommendationGroups.personalized?.slice(0, 6) || []
  const recsFromSearch = recommendationGroups.personalized?.slice(0, 6) || []
  const recsFromBrowsing = recommendationGroups.personalized?.slice(0, 6) || []
  
  // Time-based recommendations
  const recsFromSeason = recommendationGroups.time_based?.slice(0, 6) || []
  
  // Context-aware (already from backend)
  let contextTitle = ''
  let contextReason = ''
  const currentHour = new Date().getHours()
  
  if (currentHour >= 5 && currentHour < 12) {
    contextTitle = 'Morning Essentials 🌅'
    contextReason = 'Start your day with these morning favorites'
  } else if (currentHour >= 12 && currentHour < 17) {
    contextTitle = 'Afternoon Kitchen 🍳'
    contextReason = 'Perfect for your lunch and kitchen needs'
  } else if (currentHour >= 17 && currentHour < 21) {
    contextTitle = 'Evening Treats ☕'
    contextReason = 'Snacks and beverages for a perfect evening'
  } else {
    contextTitle = 'Night Care 🌙'
    contextReason = 'Relaxing beauty and hygiene picks for your night routine'
  }
  
  const recsFromContext = recommendationGroups.time_based?.map(p => ({
    ...p, 
    explanation: p.recommendation_reason || contextReason
  })).slice(0, 6) || []

  // Brand Loyalty Recommendation
  const recsFromBrand = recommendationGroups.brand_based?.slice(0, 6) || []

  // Hot Discounts Recommendation
  const recsFromDiscounts = recommendationGroups.discount?.slice(0, 6) || []

  // Category History
  const recsFromCategoryInterest = recommendationGroups.category_history?.slice(0, 6) || []

  // Trending Now
  const recsFromPopularity = recommendationGroups.trending?.slice(0, 6) || []

  // Weather/Seasonal
  const recsFromWeatherSeason = recommendationGroups.weather_seasonal?.slice(0, 6) || []
  
  // Festival/Occasion
  const recsFromFestival = recommendationGroups.festival?.slice(0, 6) || []

  // Budget Corner (Under ₹150) - Fallback if backend doesn't provide
  const recsFromBudget = products
    .filter(p => p.price <= 150)
    .sort((a, b) => a.price - b.price)
    .slice(0, 12)
    .map(p => ({...p, explanation: `Quality essentials at a pocket-friendly price.`}))

  // 8. Health & Wellness
  const healthKeywords = ['organic', 'fresh', 'fruit', 'vegetable', 'salad', 'green', 'natural', 'honey', 'oats', 'muesli', 'diet', 'low fat', 'protein', 'tea', 'juice']
  const recsFromHealthy = products
    .filter(p => healthKeywords.some(k => 
      p.name?.toLowerCase().includes(k) || 
      p.description?.toLowerCase().includes(k) || 
      p.category?.toLowerCase().includes(k)
    ))
    .slice(0, 12)
    .map(p => ({...p, explanation: `Curated for your health and wellness goals.`}))

  // 9. Just Arrived
  const recsFromNew = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 12)
    .map(p => ({...p, explanation: `Freshly added to our catalog. Be the first to try!`}))

  if (currentPage === 'login') {
    return (
      <LoginSignup
        onLoginComplete={(user) => {
          setUserId(user.id)
          setUsername(user.username || localStorage.getItem('username'))
          setCurrentPage('home')
          showToast('Logged in successfully!', 'success')
        }}
        onBackToLanding={() => setCurrentPage('home')}
        showToast={showToast}
      />
    )
  }

  return (
    <div className="app">
      <TopLoader isVisible={isNavigating} />
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <LoginSignup
              modal
              onLoginComplete={(user) => {
                setUserId(user.id)
                setUsername(user.username || user.identifier)
                setShowLoginModal(false)
                showToast('Logged in successfully!', 'success')
              }}
              onClose={() => setShowLoginModal(false)}
              onShowTerms={() => { setShowLoginModal(false); navigate('/terms') }}
              onShowPrivacy={() => { setShowLoginModal(false); navigate('/privacy') }}
              showToast={showToast}
            />
          </div>
        </div>
      )}



      {!locationPath.pathname.startsWith('/admin') && !locationPath.pathname.startsWith('/checkout') && !locationPath.pathname.startsWith('/payment') && (
        <SmallBasketHeader
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onCartClick={() => (userId ? navigate('/cart') : setShowLoginModal(true))}
          onHomeClick={() => { resetFilters(); navigate('/') }}
          onAccountClick={() => (userId ? navigate('/account') : setShowLoginModal(true))}
          onOrdersClick={() => (userId ? navigate('/orders') : setShowLoginModal(true))}
          onSmartBasketClick={() => (userId ? navigate('/smart-basket') : setShowLoginModal(true))}
          onWalletClick={() => (userId ? navigate('/wallet') : setShowLoginModal(true))}
          onContactClick={() => navigate('/contact')}
          username={username}
          orderCount={orders.length}
          walletBalance={walletBalance}
          onLogout={handleLogout}
          onLoginClick={() => setShowLoginModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          categories={BIGBASKET_CATEGORIES}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
          onAddToCart={addToCartWithQuantity}
          onUpdateQuantity={updateCartItemQuantity}
        />
      )}

      <Routes>
        <Route path="/checkout" element={
          <CheckoutPage
            addresses={deliveryAddresses}
            selectedAddressId={selectedDeliveryAddressId}
            selectedSlot={selectedDeliverySlot}
            onSelectAddress={(id) => { setSelectedDeliveryAddressId(id); persistDeliveryState(id, selectedDeliverySlot) }}
            onSelectSlot={(slot) => { setSelectedDeliverySlot(slot); persistDeliveryState(selectedDeliveryAddressId, slot) }}
            onUseCurrentLocation={useCurrentLocation}
            onAddAddress={addDeliveryAddress}
            onCancel={() => navigate('/cart')}
            onConfirm={handleConfirmDelivery}
            checkoutLoading={checkoutLoading}
            cart={cart}
          />
        } />
        <Route path="/payment" element={
          <PaymentPage
            address={selectedDeliveryAddress}
            slot={selectedDeliverySlot}
            cart={cart}
            onBack={() => navigate('/checkout')}
            onCompletePayment={handleCompletePayment}
            checkoutLoading={checkoutLoading}
          />
        } />
        <Route path="*" element={null} />
      </Routes>

      <main className="app-container">
        <Routes>
          <Route path="/" element={
            <div className="home">
              {/* Hero Section & Highlights - Only show on Home page with no filters */}
              {!searchQuery.trim() && !subCategoryFilter.trim() && activeCategory === 'All' && (
                <>
                  <section className="hero-banner">
                    <div className="banner-content">
                      <p className="eyebrow">Quality Products, Instant Checkout</p>
                      <h1>Discover fresh groceries and essentials with smart recommendations</h1>
                      <p>
                        Browse our curated selection, use smart filters and search, and enjoy personalized suggestions
                        that improve as you shop. Everything you need is just a few clicks away.
                      </p>
                      <div className="hero-actions">
                        <button className="primary-button" type="button" onClick={handleSearchSubmit}>
                          Start browsing
                        </button>
                      </div>
                    </div>

                    <div className="hero-meta">
                      <div className="hero-stat">
                        <span className="hero-stat-value">{totalProducts}</span>
                        <span className="hero-stat-label">Products matching your current view</span>
                      </div>
                      <div className="hero-stat">
                        <span className="hero-stat-value">{cart.length}</span>
                        <span className="hero-stat-label">Items already waiting in your cart</span>
                      </div>
                      <div className="hero-stat">
                        <span className="hero-stat-value">
                          {filteredRecommendations.length || 0}
                        </span>
                        <span className="hero-stat-label">Smart suggestions ready for you</span>
                      </div>
                    </div>
                  </section>

                  <section className="highlight-grid">
                    <article className="highlight-card">
                      <strong>Search that actually leads somewhere</strong>
                      <p>The navbar search now opens the home view and filters the product list immediately.</p>
                    </article>
                    <article className="highlight-card">
                      <strong>Cleaner shopping path</strong>
                      <p>Users land straight in the store, with a short branded loading screen instead of a separate landing page.</p>
                    </article>
                    <article className="highlight-card">
                      <strong>Better product flow</strong>
                      <p>Recommendations, filters, and product browsing now feel connected instead of split across disconnected screens.</p>
                    </article>
                  </section>
                </>
              )}


              {/* Recommendation Sections - Only show on pure home view */}
              {!searchQuery.trim() && !subCategoryFilter.trim() && activeCategory === 'All' && (
                <>
                  {filteredRecommendations.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Recommended</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Picked for this session</div>
                            <button onClick={() => setRecInfoModal('session')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Picked for this session</h2>
                          <p>Personalized suggestions stay aligned with your active search and category filters.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={filteredRecommendations}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromSeason.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Seasonal Highlights</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Trending for Summer</div>
                            <button onClick={() => setRecInfoModal('seasonal')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Summer Essentials ☀️</h2>
                          <p>Stay refreshed and ready for the season with our top picks.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromSeason}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromContext.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Context Aware</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Tailored for your current Time of Day</div>
                            <button onClick={() => setRecInfoModal('context')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>{contextTitle} 🕒</h2>
                          <p>{contextReason}.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromContext}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromDiscounts.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Big Savings</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: High-value discounts on quality items</div>
                            <button onClick={() => setRecInfoModal('discount')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Top Offers For You 🏷️</h2>
                          <p>Hand-picked products with the best deals and limited-time discounts.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromDiscounts}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromBrand.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Brand Focus</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Selected based on your brand affinity</div>
                            <button onClick={() => setRecInfoModal('brand')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>From Brands You Love ❤️</h2>
                          <p>Explore more products from companies you have shown interest in.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromBrand}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromCategoryInterest.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Category Interest</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Exploring your favorite categories</div>
                            <button onClick={() => setRecInfoModal('categoryInterest')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>You Viewed These Categories Before 📂</h2>
                          <p>Discover more items in the categories you browse most often.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromCategoryInterest}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromPopularity.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Top Rated</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Products with highest customer satisfaction</div>
                            <button onClick={() => setRecInfoModal('popularity')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Trending Now 🔥</h2>
                          <p>The most loved products across our community, rated 4.4+ stars.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromPopularity}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromHealthy.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Health & Wellness</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Filtered for organic and nutritious choices</div>
                            <button onClick={() => setRecInfoModal('healthy')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Healthy & Organic Choices 🥗</h2>
                          <p>Nourish your body with our selection of fresh and natural essentials.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromHealthy}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromBudget.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Budget Corner</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Best value items under ₹150</div>
                            <button onClick={() => setRecInfoModal('budget')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Smart Savings Store 💰</h2>
                          <p>Great quality products that are easy on your wallet.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromBudget}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromNew.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">New Arrivals</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Latest additions to our store catalog</div>
                            <button onClick={() => setRecInfoModal('newArrival')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Just Arrived ✨</h2>
                          <p>Be the first to explore the latest products in our collection.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromNew}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromPurchases.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Buy It Again</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Cross-referenced with your Order History</div>
                            <button onClick={() => setRecInfoModal('purchase')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Based On Your Purchases 🛒</h2>
                          <p>Items you usually buy or items that complement your past orders.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromPurchases}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromSearch.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Search Based</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Matches your recent search queries</div>
                            <button onClick={() => setRecInfoModal('search')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Because You Searched 🔍</h2>
                          <p>Products related to what you've been looking for.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromSearch}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromBrowsing.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Browsing History</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Correlated with your recent product views</div>
                            <button onClick={() => setRecInfoModal('browsing')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Because You Viewed 👁️</h2>
                          <p>Jump right back into items you checked out recently.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromBrowsing}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromContext.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Time-Aware</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Personalized based on time of day</div>
                            <button onClick={() => setRecInfoModal('context')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>{contextTitle}</h2>
                          <p>{contextReason}</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromContext}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromBrand.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Brand Affinity</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: From brands you love</div>
                            <button onClick={() => setRecInfoModal('brand')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Your Favorite Brands ⭐</h2>
                          <p>Explore more from the brands you already trust.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromBrand}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromCategoryInterest.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Category History</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: You viewed this category before</div>
                            <button onClick={() => setRecInfoModal('categoryInterest')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>More From Your Interests 🎯</h2>
                          <p>Discover new items from categories you love.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromCategoryInterest}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromDiscounts.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Hot Deals</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Best discounts available</div>
                            <button onClick={() => setRecInfoModal('discounts')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Hot Deals & Discounts 🔥</h2>
                          <p>Save big with these amazing offers.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromDiscounts}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromPopularity.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Trending</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Based on customer clicks</div>
                            <button onClick={() => setRecInfoModal('popularity')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Trending Now 📈</h2>
                          <p>Most popular items right now.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromPopularity}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromWeatherSeason.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Weather</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: Curated for current season</div>
                            <button onClick={() => setRecInfoModal('weather')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Perfect For The Season ☀️</h2>
                          <p>Essentials and favorites for today's weather.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromWeatherSeason}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}

                  {recsFromFestival.length > 0 && (
                    <section className="section recommendation-shell">
                      <div className="section-heading">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p className="eyebrow">Festival</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="xai-badge">🤖 AI Explanation: For upcoming celebrations</div>
                            <button onClick={() => setRecInfoModal('festival')} className="xai-info-btn" title="How this works">ℹ️</button>
                          </div>
                          <h2>Celebrate With Us 🎉</h2>
                          <p>Special items for special occasions.</p>
                        </div>
                      </div>
                      <Recommendations
                        products={recsFromFestival}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                    </section>
                  )}
                </>
              )}

              {(searchQuery.trim() || subCategoryFilter.trim() || activeCategory !== 'All') ? (
                <SearchResults
                  products={products}
                  totalProducts={totalProducts}
                  searchQuery={searchQuery}
                  subCategoryFilter={subCategoryFilter}
                  onAddToCart={addToCartWithQuantity}
                  onProductClick={handleOpenProduct}
                  onToggleSave={toggleSaveItem}
                  isSaved={isSaved}
                  onShowDetails={(p) => handleOpenProduct(p.id)}
                  cartItemQuantities={cartItemQuantities}
                  onUpdateQuantity={updateCartItemQuantity}
                  activeCategory={activeCategory}
                  onCategorySelect={handleCategorySelect}
                  onSubCategorySelect={handleSubCategorySelect}
                  loadMoreProducts={loadMoreProducts}
                  breadcrumbCategory={breadcrumbCategory}
                  onResetFilters={resetFilters}
                />
              ) : (
                <section className="section product-shell">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Catalog</p>
                      <h2>{activeCategory === 'All' ? 'All products' : activeCategory}</h2>
                      <p>
                        Browse quality products, open any item to improve your recommendations,
                        and add them to your cart seamlessly.
                      </p>
                    </div>
                  </div>

                  {products.length > 0 ? (
                    <>
                      <ProductGrid
                        products={products}
                        onAddToCart={addToCartWithQuantity}
                        onProductClick={handleOpenProduct}
                        onToggleSave={toggleSaveItem}
                        isSaved={isSaved}
                        onShowDetails={(p) => handleOpenProduct(p.id)}
                        cartItemQuantities={cartItemQuantities}
                        onUpdateQuantity={updateCartItemQuantity}
                      />
                      {products.length < totalProducts && (
                        <div className="load-more-container">
                          <button
                            className="load-more-btn"
                            onClick={loadMoreProducts}
                            type="button"
                          >
                            Load More Products ({products.length} of {totalProducts})
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-state">
                      <h3>No products match that view</h3>
                      <p>Try a different search term or browse all categories to see our full selection.</p>
                      <button className="ghost-button" type="button" onClick={resetFilters}>
                        Clear filters
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          } />

          <Route path="/cart" element={
            <Cart 
              cart={cart} 
              products={products} 
              onRemoveFromCart={removeFromCart} 
              onUpdateQuantity={updateCartQuantity}
              onCheckout={checkout} 
              checkoutLoading={checkoutLoading}
              savedItems={savedItems}
              onSaveForLater={saveForLater}
              onMoveToCart={moveToCart}
              onRemoveFromSaved={(id) => {
                const newSaved = savedItems.filter(i => i.id !== id)
                setSavedItems(newSaved)
                localStorage.setItem('savedItems', JSON.stringify(newSaved))
              }}
              recommendations={checkoutRecommendations}
              onAddToCart={addToCart}
              onRemoveRecommendation={dismissCheckoutRecommendation}
            />
          } />

          <Route path="/:category/:id" element={
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => navigate('/')}
              onAddToCart={addToCartWithQuantity}
              onToggleSave={toggleSaveItem}
              isSaved={isSaved}
              cartItemQuantities={cartItemQuantities}
              onUpdateQuantity={updateCartItemQuantity}
              userId={userId}
              showToast={showToast}
            />
          } />

          <Route path="/account" element={
            <Account 
              user={userData} 
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
            />
          } />

          <Route path="/wallet" element={
            <Wallet 
              balance={walletBalance} 
              onAddMoney={addWalletMoney}
            />
          } />

          <Route path="/smart-basket" element={
            <SmartBasket 
              recommendations={recommendations}
              onAddToCart={addToCartWithQuantity}
              onToggleSave={toggleSaveItem}
              isSaved={isSaved}
              cartItemQuantities={cartItemQuantities}
              onUpdateQuantity={updateCartItemQuantity}
            />
          } />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/orders" element={<MyOrders orders={orders} />} />
          <Route path="/orders/:orderId" element={<OrderDetails orders={orders} userId={userId} />} />
          <Route path="/addresses" element={<Addresses
            addresses={deliveryAddresses}
            selectedAddressId={selectedDeliveryAddressId}
            onSelectAddress={(id) => { setSelectedDeliveryAddressId(id); persistDeliveryState(id, selectedDeliverySlot) }}
            onAddAddress={addDeliveryAddress}
            onRemoveAddress={removeDeliveryAddress}
          />} />

          <Route path="/email-settings" element={<EmailSettings email={username} />} />

          <Route path="/admin" element={<AdminDashboard products={products} />} />

          <Route path="/terms" element={<Terms onBack={() => navigate('/')} />} />
          <Route path="/privacy" element={<Privacy onBack={() => navigate('/')} />} />
        </Routes>
      </main>

      {/* Footer — hidden on admin / checkout / payment */}
      {!locationPath.pathname.startsWith('/admin') &&
       !locationPath.pathname.startsWith('/checkout') &&
       !locationPath.pathname.startsWith('/payment') && (
        <Footer onCategorySelect={(cat) => { handleCategorySelect(cat); navigate('/') }} />
      )}

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Recommendation Info Modal */}
      {recInfoModal && (
        <RecommendationInfoModal 
          type={recInfoModal} 
          onClose={() => setRecInfoModal(null)} 
        />
      )}
    </div>
  )
}

export default App

