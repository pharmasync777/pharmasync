const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/obat', require('./routes/obatRoutes'));
app.use('/api/supplier', require('./routes/supplierRoutes'));
app.use('/api/pasien', require('./routes/pasienRoutes'));
app.use('/api/obat-masuk', require('./routes/obatMasukRoutes'));
app.use('/api/obat-keluar', require('./routes/obatKeluarRoutes'));
app.use('/api/transaksi', require('./routes/transaksiRoutes'));
app.use('/api/laporan', require('./routes/laporanRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'PharmaSync API berjalan' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
