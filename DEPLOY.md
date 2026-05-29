# 🚀 Panduan Deploy PharmaSync

## Arsitektur
```
GitHub Repo
├── /backend  ──→  Railway  (Node.js + MySQL)
└── /frontend ──→  Vercel   (React)
```

---

## LANGKAH 1 — Upload ke GitHub

### 1.1 Install Git (jika belum)
Download di: https://git-scm.com/download/win

### 1.2 Buat repository di GitHub
1. Buka https://github.com → klik **New repository**
2. Nama repo: `pharmasync`
3. Pilih **Private** (disarankan)
4. Klik **Create repository**

### 1.3 Push kode dari terminal
Buka terminal di folder `C:\xampp\htdocs\pharmasync` lalu jalankan:

```bash
git init
git add .
git commit -m "Initial commit: PharmaSync"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/pharmasync.git
git push -u origin main
```

---

## LANGKAH 2 — Deploy Backend ke Railway

### 2.1 Buat akun Railway
Buka https://railway.app → Sign up with GitHub

### 2.2 Buat project baru
1. Klik **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repo `pharmasync`
4. Pilih folder **`backend`** sebagai root directory

### 2.3 Tambah MySQL database
1. Di dalam project yang sama, klik **+ New**
2. Pilih **Database → MySQL**
3. Railway otomatis membuat database dan variabel koneksi

### 2.4 Set environment variables backend
Di Railway → tab **Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `DB_HOST` | `${{MySQL.MYSQL_HOST}}` |
| `DB_USER` | `${{MySQL.MYSQL_USER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQL_PASSWORD}}` |
| `DB_NAME` | `${{MySQL.MYSQL_DATABASE}}` |
| `JWT_SECRET` | `isi_string_random_panjang_minimal_32_karakter` |
| `FRONTEND_URL` | *(isi setelah deploy Vercel)* |

> **Tip:** Untuk JWT_SECRET, gunakan string acak panjang, contoh: `ph4rm4sync_s3cr3t_k3y_2026_xyz`

### 2.5 Import database schema
1. Di Railway, klik service MySQL → tab **Data**
2. Klik **Connect** → salin connection string
3. Atau gunakan **Query** tab, paste isi file `database/pharmasync.sql`
4. Jalankan juga script admin:
   - Di Railway terminal backend, jalankan: `node scripts/createAdmin.js`

### 2.6 Catat URL backend
Setelah deploy selesai, Railway memberi URL seperti:
`https://pharmasync-backend-production.up.railway.app`

---

## LANGKAH 3 — Deploy Frontend ke Vercel

### 3.1 Buat akun Vercel
Buka https://vercel.com → Sign up with GitHub

### 3.2 Import project
1. Klik **Add New → Project**
2. Pilih repo `pharmasync`
3. **Root Directory**: ganti ke `frontend`
4. **Framework Preset**: Vite (otomatis terdeteksi)

### 3.3 Set environment variable
Di bagian **Environment Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://URL-RAILWAY-KAMU.railway.app/api` |

### 3.4 Deploy
Klik **Deploy** — Vercel akan build dan deploy otomatis.

Setelah selesai, kamu dapat URL seperti:
`https://pharmasync.vercel.app`

---

## LANGKAH 4 — Hubungkan Frontend & Backend

### 4.1 Update FRONTEND_URL di Railway
Kembali ke Railway → Variables backend:
- Set `FRONTEND_URL` = `https://pharmasync.vercel.app`
- Railway akan restart otomatis

### 4.2 Test
Buka `https://pharmasync.vercel.app` → login dengan `admin` / `admin135`

---

## ✅ Checklist Deploy

- [ ] Kode sudah di-push ke GitHub
- [ ] Railway: backend running (status hijau)
- [ ] Railway: MySQL database aktif
- [ ] Railway: semua env variables terisi
- [ ] Railway: schema SQL sudah diimport
- [ ] Railway: admin user sudah dibuat
- [ ] Vercel: frontend deployed
- [ ] Vercel: `VITE_API_URL` sudah diisi URL Railway
- [ ] Railway: `FRONTEND_URL` sudah diisi URL Vercel
- [ ] Login berhasil di URL Vercel

---

## 🔄 Update kode setelah deploy

Cukup push ke GitHub, Railway dan Vercel akan auto-deploy:
```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```
