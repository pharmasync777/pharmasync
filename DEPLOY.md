# 🚀 Panduan Deploy PharmaSync ke Railway

## Arsitektur (semua dalam 1 platform)
```
Railway
├── Service: pharmasync  →  Node.js (Express serve React + API)
└── Service: MySQL       →  Database
```
Satu URL untuk segalanya. Tidak perlu Vercel atau platform lain.

---

## LANGKAH 1 — Upload ke GitHub

### 1.1 Buat repository di GitHub
1. Buka https://github.com → klik **New repository**
2. Nama: `pharmasync` → pilih **Private** → klik **Create**

### 1.2 Push dari terminal
Buka terminal di folder `C:\xampp\htdocs\pharmasync`:

```bash
git init
git add .
git commit -m "Initial commit: PharmaSync"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/pharmasync.git
git push -u origin main
```

---

## LANGKAH 2 — Deploy ke Railway

### 2.1 Buat akun
Buka https://railway.app → **Login with GitHub**

### 2.2 Buat project baru
1. Klik **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repo `pharmasync`
4. **Root Directory**: biarkan kosong (pakai root `/`)
5. Railway otomatis deteksi `package.json` di root

### 2.3 Tambah MySQL
1. Di dalam project yang sama, klik **+ Add Service**
2. Pilih **Database → MySQL**
3. Tunggu sampai MySQL aktif (status hijau)

### 2.4 Set Environment Variables
Di service `pharmasync` → tab **Variables** → klik **Raw Editor**, paste ini:

```
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}
JWT_SECRET=pharmasync_jwt_secret_ganti_ini_2026
PORT=5000
```

> ⚠️ Ganti `JWT_SECRET` dengan string acak yang panjang

### 2.5 Import Database Schema
1. Di Railway, klik service **MySQL** → tab **Data** → **Query**
2. Copy-paste seluruh isi file `database/pharmasync.sql` → klik **Run**

### 2.6 Buat User Admin
1. Di service `pharmasync` → tab **Deploy** → klik **Railway Shell** (atau gunakan terminal)
2. Jalankan:
```bash
node backend/scripts/createAdmin.js
```

### 2.7 Generate Domain
1. Di service `pharmasync` → tab **Settings**
2. Klik **Generate Domain**
3. Kamu dapat URL seperti: `https://pharmasync-production.up.railway.app`

---

## ✅ Checklist

- [ ] Kode sudah di GitHub
- [ ] Railway: service pharmasync running (hijau)
- [ ] Railway: MySQL aktif (hijau)
- [ ] Railway: semua Variables terisi
- [ ] Railway: schema SQL sudah diimport
- [ ] Railway: admin user sudah dibuat (`node backend/scripts/createAdmin.js`)
- [ ] Railway: domain sudah di-generate
- [ ] Buka URL Railway → login `admin` / `admin135` ✅

---

## 🔄 Update kode setelah deploy

Cukup push ke GitHub, Railway auto-deploy:
```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

---

## 🛠️ Development lokal (tetap bisa)

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```
Buka http://localhost:5173
