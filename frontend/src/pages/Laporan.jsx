import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Alert from '../components/Alert'
import './Page.css'
import './Laporan.css'

const TABS = ['Stok Obat', 'Obat Expired', 'Transaksi']

export default function Laporan() {
  const [tab, setTab]         = useState(0)
  const [stok, setStok]       = useState([])
  const [expired, setExpired] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState({ type: '', message: '' })
  const [dari, setDari]       = useState('')
  const [sampai, setSampai]   = useState('')

  const fetchStok = () => {
    setLoading(true)
    api.get('/laporan/stok').then(r => setStok(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  const fetchExpired = () => {
    setLoading(true)
    api.get('/laporan/expired').then(r => setExpired(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  const fetchTransaksi = () => {
    setLoading(true)
    const params = dari && sampai ? `?dari=${dari}&sampai=${sampai}` : ''
    api.get(`/laporan/transaksi${params}`).then(r => setTransaksi(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (tab === 0) fetchStok()
    if (tab === 1) fetchExpired()
    if (tab === 2) fetchTransaksi()
  }, [tab])

  const printPage = () => window.print()

  // Columns
  const colsStok = [
    { key: 'nama_obat',  label: 'Nama Obat' },
    { key: 'jenis_obat', label: 'Jenis' },
    { key: 'stok',       label: 'Stok' },
    { key: 'stok_minimum', label: 'Min Stok' },
    { key: 'harga',      label: 'Harga', render: v => `Rp ${Number(v).toLocaleString('id-ID')}` },
    { key: 'tanggal_exp',label: 'Exp Date', render: v => new Date(v).toLocaleDateString('id-ID') },
    { key: 'status_stok',label: 'Status Stok', render: v => {
      const cls = v === 'Kritis' ? 'badge-red' : v === 'Menipis' ? 'badge-orange' : 'badge-green'
      return <span className={`badge ${cls}`}>{v}</span>
    }},
    { key: 'status_exp', label: 'Status Exp', render: v => {
      const cls = v === 'Sudah Expired' ? 'badge-red' : v === 'Akan Expired' ? 'badge-orange' : 'badge-green'
      return <span className={`badge ${cls}`}>{v}</span>
    }},
  ]

  const colsExpired = [
    { key: 'nama_obat',  label: 'Nama Obat' },
    { key: 'jenis_obat', label: 'Jenis' },
    { key: 'stok',       label: 'Stok' },
    { key: 'tanggal_exp',label: 'Tanggal Exp', render: v => new Date(v).toLocaleDateString('id-ID') },
    { key: 'status', label: 'Status', render: (_, row) => {
      const diff = (new Date(row.tanggal_exp) - new Date()) / (1000*60*60*24)
      if (diff < 0) return <span className="badge badge-red">Sudah Expired</span>
      return <span className="badge badge-orange">Akan Expired ({Math.ceil(diff)} hari)</span>
    }}
  ]

  const colsTransaksi = [
    { key: 'nama_pasien',       label: 'Pasien' },
    { key: 'nama_obat',         label: 'Obat' },
    { key: 'jumlah',            label: 'Jumlah' },
    { key: 'total_harga',       label: 'Total', render: v => `Rp ${Number(v).toLocaleString('id-ID')}` },
    { key: 'tanggal_transaksi', label: 'Tanggal', render: v => new Date(v).toLocaleDateString('id-ID') },
    { key: 'username',          label: 'Petugas' },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Laporan"
        subtitle="Cetak laporan stok & kedaluwarsa"
        action={<button className="btn btn-info no-print" onClick={printPage}>🖨️ Cetak</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      {/* Tabs */}
      <div className="tabs no-print">
        {TABS.map((t, i) => (
          <button key={i} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* Filter transaksi */}
      {tab === 2 && (
        <div className="filter-bar no-print">
          <label>Dari:</label>
          <input type="date" value={dari} onChange={e => setDari(e.target.value)} />
          <label>Sampai:</label>
          <input type="date" value={sampai} onChange={e => setSampai(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={fetchTransaksi}>Filter</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setDari(''); setSampai(''); fetchTransaksi() }}>Reset</button>
        </div>
      )}

      {/* Print header */}
      <div className="print-header">
        <h2>PharmaSync — Laporan {TABS[tab]}</h2>
        <p>Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
      </div>

      <div className="page-card">
        {tab === 0 && <Table columns={colsStok}     data={stok}     loading={loading} />}
        {tab === 1 && <Table columns={colsExpired}  data={expired}  loading={loading} />}
        {tab === 2 && <Table columns={colsTransaksi} data={transaksi} loading={loading} />}
      </div>
    </div>
  )
}
