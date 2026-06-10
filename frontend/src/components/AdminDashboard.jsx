import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../config'

const TABS = ['Overview', 'Products', 'Customers', 'Orders']

export default function AdminDashboard({ products = [], adminPassword = 'admin123' }) {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuthed') === 'true')
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 })
  const [adminProducts, setAdminProducts] = useState([])
  const [adminProductSkip, setAdminProductSkip] = useState(0)
  const [adminProductTotal, setAdminProductTotal] = useState(0)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [productEdit, setProductEdit] = useState(null)

  useEffect(() => {
    if (authed) {
      fetchAll()
      fetchAdminProducts(0, false)
    }
  }, [authed])

  const fetchAdminProducts = async (skip = 0, append = false, query = '') => {
    try {
      const params = new URLSearchParams({
        skip: skip,
        limit: 50,
        search: query
      })
      const response = await fetch(`${API_BASE}/products?${params.toString()}`)
      const data = await response.json()
      if (append) {
        setAdminProducts(prev => [...prev, ...data.products])
      } else {
        setAdminProducts(data.products)
      }
      setAdminProductTotal(data.total)
    } catch (e) {
      console.error('Admin product fetch error:', e)
    }
  }

  const handleAdminSearch = (val) => {
    setSearch(val)
    setAdminProductSkip(0)
    fetchAdminProducts(0, false, val)
  }

  const loadMoreAdminProducts = () => {
    const nextSkip = adminProductSkip + 50
    setAdminProductSkip(nextSkip)
    fetchAdminProducts(nextSkip, true, search)
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [dash, users, ords] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`).then(r => r.json()).catch(() => ({ stats: { products: 0, users: 0, orders: 0 }, recent_orders: [] })),
        fetch(`${API_BASE}/admin/users`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/admin/orders`).then(r => r.json()).catch(() => []),
      ])
      setStats(dash.stats || { products: 0, users: 0, orders: 0 })
      setCustomers(Array.isArray(users) ? users : [])
      setOrders(Array.isArray(ords) ? ords : [])
    } catch (e) {
      console.error('Admin fetch error:', e)
      setCustomers([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (pwInput === adminPassword) {
      sessionStorage.setItem('adminAuthed', 'true')
      setAuthed(true)
      setPwError('')
    } else {
      setPwError('Incorrect password. Try: admin123')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthed')
    setAuthed(false)
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their orders and history will be removed.')) return
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' })
      if (res.ok) fetchAll()
    } catch (e) {
      console.error('Delete user error:', e)
    }
  }

  const toggleAdmin = async (user) => {
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: !user.is_admin })
      })
      if (res.ok) fetchAll()
    } catch (e) {
      console.error('Toggle admin error:', e)
    }
  }

  // ── Auth gate ─────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
          padding: '48px', width: '380px', textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>SmallBasket Control Center</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError('') }}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: pwError ? '1px solid #ff4757' : '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '15px',
                outline: 'none', marginBottom: '8px', boxSizing: 'border-box'
              }}
            />
            {pwError && <p style={{ color: '#ff4757', fontSize: '13px', marginBottom: '12px', textAlign: 'left' }}>{pwError}</p>}
            <button type="submit" style={{
              width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, rgb(118,185,0), rgb(80,140,0))',
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              marginTop: '8px'
            }}>
              SIGN IN
            </button>
          </form>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '24px', cursor: 'pointer' }}
             onClick={() => navigate('/')}>← Back to Store</p>
        </div>
      </div>
    )
  }

  // ── Helpers ────────────────────────────────────────────
  const filteredCustomers = customers.filter(c =>
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredOrders = orders.filter(o =>
    String(o.id).includes(search) || String(o.user_id).includes(search)
  )

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: '📦', color: 'rgb(118,185,0)', bg: 'rgba(118,185,0,0.1)' },
    { label: 'Customers', value: stats.users, icon: '👥', color: '#3498db', bg: 'rgba(52,152,219,0.1)' },
    { label: 'Total Orders', value: stats.orders, icon: '🛒', color: '#e74c3c', bg: 'rgba(231,76,60,0.1)' },
    { label: 'Revenue', value: `₹${(orders.reduce((s, o) => s + (o.total_price || 0), 0)).toFixed(0)}`, icon: '💰', color: '#f39c12', bg: 'rgba(243,156,18,0.1)' },
  ]

  const orderStatusCounts = Object.entries(orders.reduce((acc, order) => {
    const status = order.status || 'Pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})).map(([status, count]) => ({ status, count }))

  const topCustomers = [...customers]
    .sort((a, b) => (b.total_spend || 0) - (a.total_spend || 0))
    .slice(0, 5)

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const activeCustomers = new Set(orders.map((order) => order.user_id)).size
  const paymentMethodCounts = Object.entries(orders.reduce((acc, order) => {
    const method = order.payment_method || 'Unknown'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {}))
  const salesByDay = Object.entries(orders.reduce((acc, order) => {
    const day = new Date(order.created_at).toLocaleDateString('en-IN')
    acc[day] = (acc[day] || 0) + (order.total_price || 0)
    return acc
  }, {}))
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-7)

  const sidebarItems = [
    { label: 'Overview', icon: '📊' },
    { label: 'Products', icon: '📦' },
    { label: 'Customers', icon: '👥' },
    { label: 'Orders', icon: '🛒' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex', flexDirection: 'column', padding: '0', position: 'fixed',
        top: 0, left: 0, height: '100vh', zIndex: 200
      }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
            <span style={{ color: 'rgb(118,185,0)' }}>Small</span>Basket
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', marginTop: '2px' }}>ADMIN PORTAL</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {sidebarItems.map(item => (
            <button key={item.label} onClick={() => { setActiveTab(item.label); setSearch('') }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: activeTab === item.label ? 'rgba(118,185,0,0.2)' : 'transparent',
              color: activeTab === item.label ? 'rgb(118,185,0)' : 'rgba(255,255,255,0.6)',
              fontSize: '14px', fontWeight: activeTab === item.label ? 700 : 400,
              marginBottom: '4px', textAlign: 'left', transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
              {activeTab === item.label && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'rgb(118,185,0)' }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/')} style={{
            width: '100%', padding: '10px', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontSize: '13px', cursor: 'pointer', marginBottom: '8px'
          }}>← Back to Store</button>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: '8px', background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer'
          }}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px 40px', minHeight: '100vh' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{activeTab}</h1>
            <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {activeTab !== 'Overview' && (
              <input
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
                onChange={e => activeTab === 'Products' ? handleAdminSearch(e.target.value) : setSearch(e.target.value)}
                style={{
                  padding: '9px 16px', borderRadius: '8px', border: '1px solid #e0e0e0',
                  background: '#fff', fontSize: '14px', outline: 'none', width: '220px'
                }}
              />
            )}
            <button onClick={fetchAll} style={{
              padding: '9px 18px', borderRadius: '8px', border: 'none',
              background: 'rgb(118,185,0)', color: '#fff', fontWeight: 700,
              fontSize: '13px', cursor: 'pointer'
            }}>↻ Refresh</button>
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading data...</div>}

        {/* ── OVERVIEW ─── */}
        {!loading && activeTab === 'Overview' && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {statCards.map(card => (
                <div key={card.label} style={{
                  background: '#fff', borderRadius: '12px', padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#999', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 8px' }}>{card.label.toUpperCase()}</p>
                      <p style={{ fontSize: '32px', fontWeight: 800, color: card.color, margin: 0 }}>{card.value}</p>
                    </div>
                    <div style={{ background: card.bg, borderRadius: '10px', padding: '12px', fontSize: '22px' }}>{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '18px' }}>Orders by Status</h2>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {orderStatusCounts.length ? orderStatusCounts.map((item) => {
                    const width = Math.min(100, Math.max(8, (item.count / Math.max(...orderStatusCounts.map((v) => v.count))) * 100))
                    return (
                      <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '80px', color: '#555', fontSize: '13px' }}>{item.status}</span>
                        <div style={{ flex: 1, background: '#f2f7ff', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                          <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', background: '#4f8cff' }} />
                        </div>
                        <span style={{ width: '40px', textAlign: 'right', color: '#333', fontSize: '13px' }}>{item.count}</span>
                      </div>
                    )
                  }) : <div style={{ color: '#999', fontSize: '13px' }}>No order data available yet.</div>}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '18px' }}>Top Customers & Sales</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>Top spenders</div>
                    {topCustomers.length ? topCustomers.map((customer) => {
                      const maxSpend = topCustomers[0]?.total_spend || 1
                      const width = Math.min(100, Math.max(12, ((customer.total_spend || 0) / maxSpend) * 100))
                      return (
                        <div key={customer.id} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#333', marginBottom: '6px' }}>
                            <span>{customer.username}</span>
                            <span style={{ fontWeight: 700 }}>₹{(customer.total_spend || 0).toFixed(0)}</span>
                          </div>
                          <div style={{ background: '#f6f9f8', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${width}%`, height: '100%', background: '#5cb85c' }} />
                          </div>
                        </div>
                      )
                    }) : <div style={{ color: '#999', fontSize: '13px' }}>No customer spend data yet.</div>}
                  </div>
                  <div>
                    <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>Recent sales trend</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {salesByDay.length ? salesByDay.map(([day, total]) => {
                        const maxTotal = Math.max(...salesByDay.map(([, value]) => value), 1)
                        const width = Math.min(100, Math.max(10, (total / maxTotal) * 100))
                        return (
                          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '70px', color: '#555', fontSize: '12px' }}>{day}</span>
                            <div style={{ flex: 1, background: '#f4f7fc', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                              <div style={{ width: `${width}%`, height: '100%', background: '#ff9f43' }} />
                            </div>
                            <span style={{ width: '52px', textAlign: 'right', color: '#333', fontSize: '12px' }}>₹{Number(total).toFixed(0)}</span>
                          </div>
                        )
                      }) : <div style={{ color: '#999', fontSize: '13px' }}>Sales timeline unavailable.</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '14px' }}>Average Order Value</h2>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'rgb(118,185,0)' }}>₹{avgOrderValue.toFixed(0)}</div>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>{orders.length} orders total, average across the current dataset.</p>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '14px' }}>Active Customers</h2>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#3498db' }}>{activeCustomers}</div>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>Distinct customers in the current order history.</p>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '14px' }}>Payment Methods</h2>
                {paymentMethodCounts.length ? paymentMethodCounts.map(([method, count]) => {
                  const width = Math.min(100, Math.max(10, (count / Math.max(...paymentMethodCounts.map(([,c]) => c))) * 100))
                  return (
                    <div key={method} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#333' }}>
                        <span>{method}</span>
                        <span>{count}</span>
                      </div>
                      <div style={{ background: '#f4f7fc', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${width}%`, height: '100%', background: '#4f8cff' }} />
                      </div>
                    </div>
                  )
                }) : <div style={{ color: '#999', fontSize: '13px' }}>No payment method data yet.</div>}
              </div>
            </div>
            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px' }}>Recent Orders</h2>
              <Table
                headers={['Order ID', 'Customer', 'Total', 'Status', 'Date']}
                rows={orders.slice(0, 10).map(o => [
                  `#SB-${String(o.id).padStart(5, '0')}`,
                  o.username || `User #${o.user_id}`,
                  `₹${Number(o.total_price || 0).toFixed(2)}`,
                  <StatusBadge key={o.id} status={o.status} />,
                  new Date(o.created_at).toLocaleDateString('en-IN')
                ])}
                empty="No orders yet"
              />
            </div>
          </>
        )}

        {/* ── PRODUCTS ─── */}
        {!loading && activeTab === 'Products' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                All Products <span style={{ color: '#999', fontWeight: 400 }}>({adminProductTotal})</span>
              </h2>
            </div>
            <Table
              headers={['ID', 'Name', 'Category', 'Price', 'Brand', 'Rating']}
              rows={adminProducts.map(p => [
                p.id,
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {p.image_url && <img src={p.image_url} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#f9f9f9' }} />}
                  <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.name}</span>
                </div>,
                <span key={p.id} style={{ background: '#f0f9e0', color: 'rgb(94,148,0)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p.category}</span>,
                `₹${Number(p.price || 0).toFixed(2)}`,
                p.brand || '—',
                p.rating ? `⭐ ${Number(p.rating).toFixed(1)}` : '—'
              ])}
              empty="No products found"
            />
            {adminProducts.length < adminProductTotal && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button onClick={loadMoreAdminProducts} style={{
                  padding: '10px 24px', borderRadius: '8px', border: '1px solid #ddd',
                  background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer'
                }}>
                  Load More ({adminProducts.length} of {adminProductTotal})
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS ─── */}
        {!loading && activeTab === 'Customers' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px' }}>
              All Customers <span style={{ color: '#999', fontWeight: 400 }}>({filteredCustomers.length})</span>
            </h2>
            <Table
              headers={['ID', 'Username', 'Email', 'Full Name', 'Orders', 'Spend', 'Role', 'Actions']}
              rows={filteredCustomers.map(c => [
                c.id,
                c.username,
                c.email,
                c.full_name || <span style={{ color: '#ccc' }}>—</span>,
                <span key={c.id} style={{ fontWeight: 700 }}>{c.order_count || 0}</span>,
                <span key={c.id} style={{ color: 'rgb(118,185,0)', fontWeight: 700 }}>₹{(c.total_spend || 0).toFixed(2)}</span>,
                c.is_admin
                  ? <span style={{ background: '#fdecea', color: '#e74c3c', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Admin</span>
                  : <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Customer</span>,
                <div key={c.id} style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => toggleAdmin(c)} style={{
                    padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd',
                    background: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 600
                  }}>
                    {c.is_admin ? 'Make Customer' : 'Make Admin'}
                  </button>
                  <button onClick={() => deleteUser(c.id)} style={{
                    padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(231,76,60,0.3)',
                    background: 'rgba(231,76,60,0.05)', color: '#e74c3c', fontSize: '11px', cursor: 'pointer', fontWeight: 600
                  }}>
                    Delete
                  </button>
                </div>
              ])}
              empty="No customers yet"
            />
          </div>
        )}

        {/* ── ORDERS ─── */}
        {!loading && activeTab === 'Orders' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px' }}>
              All Orders <span style={{ color: '#999', fontWeight: 400 }}>({filteredOrders.length})</span>
            </h2>
            <Table
              headers={['Order ID', 'Customer', 'Total', 'Status', 'Date']}
              rows={filteredOrders.map(o => [
                `#SB-${String(o.id).padStart(5, '0')}`,
                o.username || `User #${o.user_id}`,
                `₹${Number(o.total_price || 0).toFixed(2)}`,
                <StatusBadge key={o.id} status={o.status} />,
                new Date(o.created_at).toLocaleDateString('en-IN')
              ])}
              empty="No orders yet"
            />
          </div>
        )}

      </main>
    </div>
  )
}

// ── Shared table component ─────────────────────────────
function Table({ headers, rows, empty }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#999', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ padding: '40px', textAlign: 'center', color: '#bbb' }}>{empty}</td></tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f8f8f8' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafff5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '12px 14px', color: '#333', verticalAlign: 'middle' }}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Delivered: { bg: '#e8f5e9', color: '#2e7d32' },
    Processing: { bg: '#fff8e1', color: '#f57f17' },
    Cancelled: { bg: '#fdecea', color: '#c62828' },
  }
  const style = map[status] || { bg: '#ede7f6', color: '#4527a0' }
  return (
    <span style={{ background: style.bg, color: style.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
      {status || 'Pending'}
    </span>
  )
}
