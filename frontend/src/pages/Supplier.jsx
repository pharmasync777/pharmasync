import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import './Page.css'

const emptyForm = { nama_supplier: '', alamat: '', no_telp: '' }

export default function Supplier() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm]       = useState(emptyForm)
  const [alert, setAlert]     = useState({ type: '', message: '' })
  const [search, setSearch]   = useState('')

  const fetchData = () => {
    setLoading(true)
    api.get('/supplier').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openAdd  = () => { setEditData(null); setForm(emptyForm); setModal(true) }
  const openEdit = (row) => { setEditData(row); setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setEditData(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await api.put(`/supplier/${editData.id_supplier}`, form)
        setAlert({ type: 'success', message: 'Supplier berhasil diupdate' })
      } else {
        await api.post('/supplier', form)
        setAlert({ type: 'success', message: 'Supplier berhasil ditambahkan' })
      }
      closeModal(); fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Terjadi kesalahan' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus supplier ini?')) return
    try {
      await api.delete(`/supplier/${id}`)
      setAlert({ type: 'success', message: 'Supplier berhasil dihapus' })
      fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus' })
    }
  }

  const filtered = data.filter(d => d.nama_supplier.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'nama_supplier', label: 'Nama Supplier' },
    { key: 'alamat',        label: 'Alamat' },
    { key: 'no_telp',       label: 'No. Telepon' },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <div className="action-btns">
        <button className="btn btn-sm btn-warning" onClick={() => openEdit(row)}>Edit</button>
        <button className="btn btn-sm btn-danger"  onClick={() => handleDelete(row.id_supplier)}>Hapus</button>
      </div>
    )}
  ]

  return (
    <div className="page">
      <PageHeader
        title="Supplier"
        subtitle="Kelola data pemasok obat"
        action={<button className="btn btn-primary" onClick={openAdd}>+ Tambah Supplier</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <div className="page-card">
        <div className="card-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Cari supplier..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {modal && (
        <Modal title={editData ? 'Edit Supplier' : 'Tambah Supplier'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Nama Supplier *</label>
              <input value={form.nama_supplier} onChange={e => setForm({...form, nama_supplier: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Alamat</label>
              <textarea rows="3" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
            </div>
            <div className="form-group">
              <label>No. Telepon</label>
              <input value={form.no_telp} onChange={e => setForm({...form, no_telp: e.target.value})} />
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
