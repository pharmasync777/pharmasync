const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();

// ── CORS ──────────────────────────────────────────────
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── API Routes ────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/obat', require('./routes/obatRoutes'));
app.use('/api/supplier', require('./routes/supplierRoutes'));
app.use('/api/pasien', require('./routes/pasienRoutes'));
app.use('/api/obat-masuk', require('./routes/obatMasukRoutes'));
app.use('/api/obat-keluar', require('./routes/obatKeluarRoutes'));
app.use('/api/transaksi', require('./routes/transaksiRoutes'));
app.use('/api/laporan', require('./routes/laporanRoutes'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'PharmaSync API berjalan'
    });
});

// ── Serve React build ─────────────────────────────────
const frontendDist = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendDist));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// ── Start server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
});