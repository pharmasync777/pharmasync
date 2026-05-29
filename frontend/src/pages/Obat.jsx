import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import './Page.css'

const emptyForm = { nama_obat: '', jenis_obat: '', stok: '', harga: '', tanggal_exp: '', stok_minimum: 10 }

export default function Obat() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm]       = useState(emptyForm)
  const [alert, setAlert]     = useState({ type: '', message: '' })
  const [search, setSearch]   = useState('')

  const fetchData = () => {
    setLoading(true)
    api.get('/obat').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openAdd  = () => { setEditData(null); setForm(emptyForm); setModal(true) }
  const openEdit = (row) => { setEditData(row); setForm({ ...row, tanggal_exp: row.tanggal_exp?.slice(0,10) }); setModal(true) }
  const closeModal = () => { setModal(false); setEditData(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await api.put(`/obat/${editData.id_obat}`, form)
        setAlert({ type: 'success', message: 'Obat berhasil diupdate' })
      } else {
        await api.post('/obat', form)
        setAlert({ type: 'success', message: 'Obat berhasil ditambahkan' })
      }
      closeModal(); fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Terjadi kesalahan' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus obat ini?')) return
    try {
      await api.delete(`/obat/${id}`)
      setAlert({ type: 'success', message: 'Obat berhasil dihapus' })
      fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus' })
    }
  }

  const filtered = data.filter(d =>
    d.nama_obat.toLowerCase().includes(search.toLowerCase()) ||
    d.jenis_obat.toLowerCase().includes(search.toLowerCase())
  )

  const statusStok = (stok, min) => {
    if (stok <= min)     return <span className="badge badge-red">Kritis</span>
    if (stok <= min * 2) return <span className="badge badge-orange">Menipis</span>
    return <span className="badge badge-green">Aman</span>
  }

  const statusExp = (tgl) => {
    const exp = new Date(tgl)
    const now = new Date()
    const diff = (exp - now) / (1000 * 60 * 60 * 24)
    if (diff < 0)   return <span className="badge badge-red">Expired</span>
    if (diff <= 30) return <span className="badge badge-orange">Segera Exp</span>
    return <span className="badge badge-green">Aman</span>
  }

  const columns = [
    { key: 'nama_obat',  label: 'Nama Obat' },
    { key: 'jenis_obat', label: 'Jenis' },
    { key: 'stok',       label: 'Stok', render: (v, row) => <>{v} {statusStok(v, row.stok_minimum)}</> },
    { key: 'harga',      label: 'Harga', render: v => `Rp ${Number(v).toLocaleString('id-ID')}` },
    { key: 'tanggal_exp',label: 'Exp Date', render: (v, row) => <>{new Date(v).toLocaleDateString('id-ID')} {statusExp(v)}</> },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <div className="action-btns">
        <button className="btn btn-sm btn-warning" onClick={() => openEdit(row)}>Edit</button>
        <button className="btn btn-sm btn-danger"  onClick={() => handleDelete(row.id_obat)}>Hapus</button>
      </div>
    )}
  ]

  return (
    <div className="page">
      <PageHeader
        title="Data Obat"
        subtitle="Kelola seluruh data obat"
        action={<button className="btn btn-primary" onClick={openAdd}>+ Tambah Obat</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <div className="page-card">
        <div className="card-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Cari nama / jenis obat..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {modal && (
        <Modal title={editData ? 'Edit Obat' : 'Tambah Obat'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nama Obat *</label>
                <input value={form.nama_obat} onChange={e => setForm({...form, nama_obat: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Jenis Obat *</label>
                <select value={form.jenis_obat} onChange={e => setForm({...form, jenis_obat: e.target.value})} required>
                  <option value="">Pilih jenis</option>
                  <option>Tablet</option><option>Kapsul</option><option>Sirup</option>
                  <option>Injeksi</option><option>Salep</option><option>Tetes</option><option>Lainnya</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stok Awal</label>
                <input type="number" min="0" value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stok Minimum *</label>
                <input type="number" min="1" value={form.stok_minimum} onChange={e => setForm({...form, stok_minimum: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Harga (Rp) *</label>
                <input type="number" min="0" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tanggal Kedaluwarsa *</label>
                <input type="date" value={form.tanggal_exp} onChange={e => setForm({...form, tanggal_exp: e.target.value})} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
