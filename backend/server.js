const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();

// ── CORS ──────────────────────────────────────────────
// Di production, frontend di-serve dari Express sendiri
// jadi CORS hanya dibutuhkan saat development lokal
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            'http://localhost:5173',
            'http://localhost:5000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        if (!origin || allowed.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── API Routes ────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/obat',       require('./routes/obatRoutes'));
app.use('/api/supplier',   require('./routes/supplierRoutes'));
app.use('/api/pasien',     require('./routes/pasienRoutes'));
app.use('/api/obat-masuk', require('./routes/obatMasukRoutes'));
app.use('/api/obat-keluar',require('./routes/obatKeluarRoutes'));
app.use('/api/transaksi',  require('./routes/transaksiRoutes'));
app.use('/api/laporan',    require('./routes/laporanRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'PharmaSync API berjalan' });
});

// ── Serve React build (production) ───────────────────
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Semua route selain /api diarahkan ke React
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// ── Start server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
});
