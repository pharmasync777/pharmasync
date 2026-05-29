import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Login.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Left decorative panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">💊</div>
          <span className="login-brand-name">PharmaSync</span>
        </div>
        <h1 className="login-headline">
          Kelola Persediaan Obat<br />
          <span>Lebih Cerdas & Efisien</span>
        </h1>
        <p className="login-desc">
          Sistem manajemen persediaan obat terintegrasi untuk apotek dan fasilitas kesehatan.
        </p>
        <div className="login-features">
          {['Monitoring stok real-time', 'Notifikasi kedaluwarsa otomatis', 'Laporan lengkap & cetak', 'Manajemen transaksi pasien'].map(f => (
            <div key={f} className="login-feature">
              <div className="login-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Selamat Datang</h2>
            <p>Masuk ke akun PharmaSync Anda</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
