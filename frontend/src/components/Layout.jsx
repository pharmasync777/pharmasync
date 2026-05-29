import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const navItems = [
  { to: '/dashboard',   icon: '⊞',  label: 'Dashboard' },
  { to: '/obat',        icon: '💊', label: 'Data Obat' },
  { to: '/obat-masuk',  icon: '↓',  label: 'Obat Masuk' },
  { to: '/obat-keluar', icon: '↑',  label: 'Obat Keluar' },
  { to: '/transaksi',   icon: '⇄',  label: 'Transaksi' },
  { to: '/supplier',    icon: '🏭', label: 'Supplier' },
  { to: '/pasien',      icon: '👤', label: 'Pasien' },
  { to: '/laporan',     icon: '📋', label: 'Laporan' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon-wrap">💊</div>
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-name">PharmaSync</span>
                <span className="logo-tagline">Manajemen Persediaan</span>
              </div>
            )}
          </div>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {sidebarOpen && <div className="nav-section-label">Menu Utama</div>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <div className="nav-icon-wrap">{item.icon}</div>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            {sidebarOpen && (
              <div className="user-details">
                <span className="user-name">{user?.username}</span>
                <span className="user-level">{user?.level}</span>
              </div>
            )}
            {sidebarOpen && (
              <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
