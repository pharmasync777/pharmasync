import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Obat from './pages/Obat'
import ObatMasuk from './pages/ObatMasuk'
import ObatKeluar from './pages/ObatKeluar'
import Transaksi from './pages/Transaksi'
import Supplier from './pages/Supplier'
import Pasien from './pages/Pasien'
import Laporan from './pages/Laporan'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'1.2rem', color:'#4f46e5' }}>Memuat...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="obat" element={<Obat />} />
            <Route path="obat-masuk" element={<ObatMasuk />} />
            <Route path="obat-keluar" element={<ObatKeluar />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="pasien" element={<Pasien />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
