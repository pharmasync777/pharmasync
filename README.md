# 💊 PharmaSync — Sistem Manajemen Persediaan Obat

## Stack Teknologi
- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express.js
- **Database**: MySQL (via XAMPP)

---

## 🚀 Cara Menjalankan

### 1. Setup Database
1. Buka **phpMyAdmin** → http://localhost/phpmyadmin
2. Import file `database/pharmasync.sql`
3. Database `pharmasync` akan terbuat otomatis

### 2. Setup Backend
```bash
cd backend
npm install
node scripts/createAdmin.js   # buat user admin (sekali saja)
npm run dev                   # jalankan server di port 5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev                   # jalankan di http://localhost:5173
```

---

## 🔑 Login Default
| Username | Password |
|----------|----------|
| admin    | admin135 |

---

## 📋 Fitur
| Fitur | Keterangan |
|-------|-----------|
| Dashboard | Ringkasan stok, expired, transaksi hari ini |
| Data Obat | CRUD obat + status stok & expired |
| Obat Masuk | Catat penerimaan obat, stok otomatis bertambah |
| Obat Keluar | Catat pengeluaran, notifikasi stok kritis |
| Transaksi | Pemberian obat ke pasien + kalkulasi total |
| Supplier | CRUD data pemasok |
| Pasien | CRUD data pasien |
| Laporan | Laporan stok, expired, transaksi + cetak |

---

## 📁 Struktur Project
```
pharmasync/
├── database/
│   └── pharmasync.sql
├── backend/
│   ├── config/database.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── routes/
│   ├── scripts/createAdmin.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   ├── utils/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```
