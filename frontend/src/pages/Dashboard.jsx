import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import './Dashboard.css'

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon-box">{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/laporan/dashboard')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  if (loading) return <div className="dash-loading">⏳ Memuat dashboard...</div>
  if (!data)   return <div className="dash-loading">Gagal memuat data</div>

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={today}
      />

      <div className="stats-grid">
        <StatCard icon="💊" label="Total Jenis Obat"     value={data.total_obat}            color="blue"   />
        <StatCard icon="⚠️" label="Stok Kritis"          value={data.stok_kritis}           color="red"    sub="Perlu restock segera" />
        <StatCard icon="📅" label="Mendekati Expired"    value={data.obat_expired}          color="orange" sub="dalam 30 hari ke depan" />
        <StatCard icon="🧾" label="Transaksi Hari Ini"   value={data.transaksi_hari_ini}    color="green"  />
        <StatCard icon="🏭" label="Total Supplier"       value={data.total_supplier}        color="purple" />
        <StatCard icon="👤" label="Total Pasien"         value={data.total_pasien}          color="teal"   />
        <StatCard icon="📥" label="Obat Masuk Bulan Ini" value={data.obat_masuk_bulan_ini}  color="blue"   sub="unit diterima" />
        <StatCard icon="📤" label="Obat Keluar Bulan Ini"value={data.obat_keluar_bulan_ini} color="indigo" sub="unit dikeluarkan" />
      </div>

      <div className="dash-lists">
        {/* Stok kritis */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span>⚠️ &nbsp;Stok Kritis / Menipis</span>
            <span className="badge badge-red">{data.list_kritis.length} item</span>
          </div>
          {data.list_kritis.length === 0 ? (
            <p className="dash-empty">✅ Semua stok dalam kondisi aman</p>
          ) : (
            <ul className="dash-list">
              {data.list_kritis.map((o, i) => (
                <li key={i} className="dash-list-item">
                  <span className="item-name">{o.nama_obat}</span>
                  <span className="badge badge-red">Sisa {o.stok} / Min {o.stok_minimum}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Akan expired */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span>📅 &nbsp;Mendekati Kedaluwarsa</span>
            <span className="badge badge-orange">{data.list_expired.length} item</span>
          </div>
          {data.list_expired.length === 0 ? (
            <p className="dash-empty">✅ Tidak ada obat yang akan expired</p>
          ) : (
            <ul className="dash-list">
              {data.list_expired.map((o, i) => (
                <li key={i} className="dash-list-item">
                  <span className="item-name">{o.nama_obat}</span>
                  <span className="badge badge-orange">{new Date(o.tanggal_exp).toLocaleDateString('id-ID')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
