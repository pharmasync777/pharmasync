import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import './Page.css'

const today = new Date().toISOString().slice(0, 10)
const emptyForm = { id_obat: '', id_pasien: '', jumlah: '', tanggal_transaksi: today }

export default function Transaksi() {
  const [data, setData]           = useState([])
  const [obatList, setObatList]   = useState([])
  const [pasienList, setPasienList] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [alert, setAlert]         = useState({ type: '', message: '' })
  const [preview, setPreview]     = useState(null)

  const fetchData = () => {
    setLoading(true)
    Promise.all([api.get('/transaksi'), api.get('/obat'), api.get('/pasien')])
      .then(([d, o, p]) => { setData(d.data); setObatList(o.data); setPasienList(p.data) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  // Preview harga saat pilih obat & jumlah
  useEffect(() => {
    if (form.id_obat && form.jumlah) {
      const obat = obatList.find(o => o.id_obat == form.id_obat)
      if (obat) setPreview(obat.harga * form.jumlah)
    } else {
      setPreview(null)
    }
  }, [form.id_obat, form.jumlah, obatList])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/transaksi', form)
      let msg = `Transaksi berhasil. Total: Rp ${Number(res.data.total_harga).toLocaleString('id-ID')}`
      if (res.data.stok_kritis) msg += ` ⚠️ Stok ${res.data.nama_obat} kritis!`
      setAlert({ type: res.data.stok_kritis ? 'warning' : 'success', message: msg })
      setModal(false); setForm(emptyForm); fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini? Stok akan dikembalikan.')) return
    try {
      await api.delete(`/transaksi/${id}`)
      setAlert({ type: 'success', message: 'Transaksi berhasil dihapus' })
      fetchData()
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus' })
    }
  }

  const columns = [
    { key: 'nama_pasien',        label: 'Pasien' },
    { key: 'nama_obat',          label: 'Obat' },
    { key: 'jumlah',             label: 'Jumlah', render: v => `${v} unit` },
    { key: 'total_harga',        label: 'Total', render: v => `Rp ${Number(v).toLocaleString('id-ID')}` },
    { key: 'tanggal_transaksi',  label: 'Tanggal', render: v => new Date(v).toLocaleDateString('id-ID') },
    { key: 'username',           label: 'Petugas' },
    { key: 'aksi', label: 'Aksi', render: (_, row) => (
      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id_transaksi)}>Hapus</button>
    )}
  ]

  return (
    <div className="page">
      <PageHeader
        title="Transaksi"
        subtitle="Catat transaksi pemberian obat ke pasien"
        action={<button className="btn btn-primary" onClick={() => { setForm(emptyForm); setModal(true) }}>+ Transaksi Baru</button>}
      />

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <div className="page-card">
        <Table columns={columns} data={data} loading={loading} />
      </div>

      {modal && (
        <Modal title="Transaksi Obat" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Pasien *</label>
              <select value={form.id_pasien} onChange={e => setForm({...form, id_pasien: e.target.value})} required>
                <option value="">Pilih pasien</option>
                {pasienList.map(p => <option key={p.id_pasien} value={p.id_pasien}>{p.nama_pasien}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Obat *</label>
              <select value={form.id_obat} onChange={e => setForm({...form, id_obat: e.target.value})} required>
                <option value="">Pilih obat</option>
                {obatList.map(o => <option key={o.id_obat} value={o.id_obat}>{o.nama_obat} — Stok: {o.stok} — Rp {Number(o.harga).toLocaleString('id-ID')}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Jumlah *</label>
                <input type="number" min="1" value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tanggal *</label>
                <input type="date" value={form.tanggal_transaksi} onChange={e => setForm({...form, tanggal_transaksi: e.target.value})} required />
              </div>
            </div>
            {preview !== null && (
              <div className="preview-total">
                Total: <strong>Rp {Number(preview).toLocaleString('id-ID')}</strong>
              </div>
            )}
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
