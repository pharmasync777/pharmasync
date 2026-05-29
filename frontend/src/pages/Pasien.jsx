import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import './Page.css'

const emptyForm = { nama_pasien: '', jenis_kelamin: '', alamat: '', no_telp: '' }

export default function Pasien() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm]       = useState(emptyForm)
  const [alert, setAlert]     = useState({ type: '', message: '' })
  const [search, setSearch]   = useState('')

  const fetchData = () => {
    setLoading(true)
    api.get('/pasien').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openAdd  = () => { setEditData(null); setForm(emptyForm); setModal(true) }
  const openEdit = (row) => { setEditData(row); setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setEditData(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await api.put(`/pasien/${editData.id_pasien}`, form)
        setAlert({ type: 'success', message: 'Pasien berhasil diupdate' })
      } else {
        await api.post('/pasien', form)
        setAlert({ type: 'success', message: 'Pasien berhasil ditambahkan' })
      }
      closeModal(); fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Terjadi kesalahan' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus pasien ini?')) return
    try {
      await api.delete(`/pasien/${id}`)
      setAlert({ type: 'success', message: 'Pasien berhasil dihapus' })
      fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus' })
    }
  }

  const filtered = data.filter(d => d.nama_pasien.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'nama_pasien',  label: 'Nama Pasien' },
    { key: 'jenis_kelamin',label: 'Jenis Kelamin' },
    { key: 'alamat',       label: 'Alamat' },
    { key: 'no_telp',      label: 'No. Telepon' },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <div className="action-btns">
        <button className="btn btn-sm btn-warning" onClick={() => openEdit(row)}>Edit</button>
        <button className="btn btn-sm btn-danger"  onClick={() => handleDelete(row.id_pasien)}>Hapus</button>
      </div>
    )}
  ]

  return (
    <div className="page">
      <PageHeader
        title="Pasien"
        subtitle="Kelola data pasien"
        action={<button className="btn btn-primary" onClick={openAdd}>+ Tambah Pasien</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <div className="page-card">
        <div className="card-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Cari nama pasien..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {modal && (
        <Modal title={editData ? 'Edit Pasien' : 'Tambah Pasien'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Nama Pasien *</label>
              <input value={form.nama_pasien} onChange={e => setForm({...form, nama_pasien: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Jenis Kelamin</label>
              <select value={form.jenis_kelamin} onChange={e => setForm({...form, jenis_kelamin: e.target.value})}>
                <option value="">Pilih</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alamat</label>
              <textarea rows="2" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
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
