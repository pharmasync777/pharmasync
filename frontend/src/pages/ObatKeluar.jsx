import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import './Page.css'

const today = new Date().toISOString().slice(0, 10)
const emptyForm = { id_obat: '', jumlah_keluar: '', tanggal_keluar: today }

export default function ObatKeluar() {
  const [data, setData]         = useState([])
  const [obatList, setObatList] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [alert, setAlert]       = useState({ type: '', message: '' })

  const fetchData = () => {
    setLoading(true)
    Promise.all([api.get('/obat-keluar'), api.get('/obat')])
      .then(([d, o]) => { setData(d.data); setObatList(o.data) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/obat-keluar', form)
      let msg = res.data.message
      if (res.data.stok_kritis) msg += ` ⚠️ Stok ${res.data.nama_obat} kritis! (sisa: ${res.data.stok_sisa})`
      setAlert({ type: res.data.stok_kritis ? 'warning' : 'success', message: msg })
      setModal(false); setForm(emptyForm); fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus data ini? Stok akan dikembalikan.')) return
    try {
      await api.delete(`/obat-keluar/${id}`)
      setAlert({ type: 'success', message: 'Data berhasil dihapus' })
      fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus' })
    }
  }

  const columns = [
    { key: 'nama_obat',      label: 'Nama Obat' },
    { key: 'jenis_obat',     label: 'Jenis' },
    { key: 'jumlah_keluar',  label: 'Jumlah', render: v => `${v} unit` },
    { key: 'tanggal_keluar', label: 'Tanggal', render: v => new Date(v).toLocaleDateString('id-ID') },
    { key: 'username',       label: 'Petugas' },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id_keluar)}>Hapus</button>
    )}
  ]

  return (
    <div className="page">
      <PageHeader
        title="Obat Keluar"
        subtitle="Catat pengeluaran obat"
        action={<button className="btn btn-primary" onClick={() => { setForm(emptyForm); setModal(true) }}>+ Tambah</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <div className="page-card">
        <Table columns={columns} data={data} loading={loading} />
      </div>

      {modal && (
        <Modal title="Catat Obat Keluar" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Obat *</label>
              <select value={form.id_obat} onChange={e => setForm({...form, id_obat: e.target.value})} required>
                <option value="">Pilih obat</option>
                {obatList.map(o => <option key={o.id_obat} value={o.id_obat}>{o.nama_obat} (Stok: {o.stok})</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Jumlah *</label>
                <input type="number" min="1" value={form.jumlah_keluar} onChange={e => setForm({...form, jumlah_keluar: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tanggal Keluar *</label>
                <input type="date" value={form.tanggal_keluar} onChange={e => setForm({...form, tanggal_keluar: e.target.value})} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
