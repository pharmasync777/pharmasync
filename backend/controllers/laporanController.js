const db = require('../config/database');

// Laporan stok semua obat
exports.getLaporanStok = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                id_obat,
                nama_obat,
                jenis_obat,
                stok,
                stok_minimum,
                harga,
                tanggal_exp,
                CASE 
                    WHEN stok <= stok_minimum THEN 'Kritis'
                    WHEN stok <= stok_minimum * 2 THEN 'Menipis'
                    ELSE 'Aman'
                END AS status_stok,
                CASE
                    WHEN tanggal_exp < CURDATE() THEN 'Sudah Expired'
                    WHEN tanggal_exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Akan Expired'
                    ELSE 'Aman'
                END AS status_exp
            FROM obat
            ORDER BY nama_obat
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Laporan obat expired
exports.getLaporanExpired = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT * FROM obat 
            WHERE tanggal_exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            ORDER BY tanggal_exp
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Laporan transaksi per periode
exports.getLaporanTransaksi = async (req, res) => {
    try {
        const { dari, sampai } = req.query;

        let query = `
            SELECT t.*, o.nama_obat, u.username, p.nama_pasien
            FROM transaksi t
            JOIN obat o ON t.id_obat = o.id_obat
            JOIN user u ON t.id_user = u.id_user
            JOIN pasien p ON t.id_pasien = p.id_pasien
        `;

        const params = [];

        if (dari && sampai) {
            query += ' WHERE t.tanggal_transaksi BETWEEN ? AND ?';
            params.push(dari, sampai);
        }

        query += ' ORDER BY t.tanggal_transaksi DESC';

        const [data] = await db.query(query, params);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const [[totalObat]] = await db.query('SELECT COUNT(*) as total FROM obat');
        const [[stokKritis]] = await db.query('SELECT COUNT(*) as total FROM obat WHERE stok <= stok_minimum');
        const [[obatExpired]] = await db.query("SELECT COUNT(*) as total FROM obat WHERE tanggal_exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)");
        const [[totalTransaksiHariIni]] = await db.query("SELECT COUNT(*) as total FROM transaksi WHERE tanggal_transaksi = CURDATE()");
        const [[totalSupplier]] = await db.query('SELECT COUNT(*) as total FROM supplier');
        const [[totalPasien]] = await db.query('SELECT COUNT(*) as total FROM pasien');

        // Obat masuk bulan ini
        const [[obatMasukBulanIni]] = await db.query(
            "SELECT COALESCE(SUM(jumlah_masuk), 0) as total FROM obat_masuk WHERE MONTH(tanggal_masuk) = MONTH(CURDATE()) AND YEAR(tanggal_masuk) = YEAR(CURDATE())"
        );

        // Obat keluar bulan ini
        const [[obatKeluarBulanIni]] = await db.query(
            "SELECT COALESCE(SUM(jumlah_keluar), 0) as total FROM obat_keluar WHERE MONTH(tanggal_keluar) = MONTH(CURDATE()) AND YEAR(tanggal_keluar) = YEAR(CURDATE())"
        );

        // Daftar stok kritis
        const [listKritis] = await db.query(
            'SELECT nama_obat, stok, stok_minimum FROM obat WHERE stok <= stok_minimum ORDER BY stok LIMIT 5'
        );

        // Daftar akan expired
        const [listExpired] = await db.query(
            "SELECT nama_obat, stok, tanggal_exp FROM obat WHERE tanggal_exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY tanggal_exp LIMIT 5"
        );

        res.json({
            total_obat: totalObat.total,
            stok_kritis: stokKritis.total,
            obat_expired: obatExpired.total,
            transaksi_hari_ini: totalTransaksiHariIni.total,
            total_supplier: totalSupplier.total,
            total_pasien: totalPasien.total,
            obat_masuk_bulan_ini: obatMasukBulanIni.total,
            obat_keluar_bulan_ini: obatKeluarBulanIni.total,
            list_kritis: listKritis,
            list_expired: listExpired
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
