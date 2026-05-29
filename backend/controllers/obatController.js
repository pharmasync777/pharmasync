const db = require('../config/database');

// Get semua obat
exports.getAllObat = async (req, res) => {
    try {
        const [obat] = await db.query('SELECT * FROM obat ORDER BY nama_obat');
        res.json(obat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Get obat by ID
exports.getObatById = async (req, res) => {
    try {
        const [obat] = await db.query('SELECT * FROM obat WHERE id_obat = ?', [req.params.id]);
        
        if (obat.length === 0) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }
        
        res.json(obat[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Tambah obat baru
exports.createObat = async (req, res) => {
    try {
        const { nama_obat, jenis_obat, stok, harga, tanggal_exp, stok_minimum } = req.body;

        if (!nama_obat || !jenis_obat || !harga || !tanggal_exp) {
            return res.status(400).json({ message: 'Data obat tidak lengkap' });
        }

        const [result] = await db.query(
            'INSERT INTO obat (nama_obat, jenis_obat, stok, harga, tanggal_exp, stok_minimum) VALUES (?, ?, ?, ?, ?, ?)',
            [nama_obat, jenis_obat, stok || 0, harga, tanggal_exp, stok_minimum || 10]
        );

        res.status(201).json({
            message: 'Obat berhasil ditambahkan',
            id_obat: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Update obat
exports.updateObat = async (req, res) => {
    try {
        const { nama_obat, jenis_obat, stok, harga, tanggal_exp, stok_minimum } = req.body;

        const [result] = await db.query(
            'UPDATE obat SET nama_obat = ?, jenis_obat = ?, stok = ?, harga = ?, tanggal_exp = ?, stok_minimum = ? WHERE id_obat = ?',
            [nama_obat, jenis_obat, stok, harga, tanggal_exp, stok_minimum, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        res.json({ message: 'Obat berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Delete obat
exports.deleteObat = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM obat WHERE id_obat = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        res.json({ message: 'Obat berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Get obat yang akan expired (dalam 30 hari)
exports.getObatExpired = async (req, res) => {
    try {
        const [obat] = await db.query(
            'SELECT * FROM obat WHERE tanggal_exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) ORDER BY tanggal_exp'
        );
        res.json(obat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Get obat dengan stok kritis
exports.getObatKritis = async (req, res) => {
    try {
        const [obat] = await db.query(
            'SELECT * FROM obat WHERE stok <= stok_minimum ORDER BY stok'
        );
        res.json(obat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
