const db = require('../config/database');

// Get semua pasien
exports.getAllPasien = async (req, res) => {
    try {
        const [pasien] = await db.query('SELECT * FROM pasien ORDER BY nama_pasien');
        res.json(pasien);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Get pasien by ID
exports.getPasienById = async (req, res) => {
    try {
        const [pasien] = await db.query('SELECT * FROM pasien WHERE id_pasien = ?', [req.params.id]);
        
        if (pasien.length === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }
        
        res.json(pasien[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Tambah pasien
exports.createPasien = async (req, res) => {
    try {
        const { nama_pasien, jenis_kelamin, alamat, no_telp } = req.body;

        if (!nama_pasien) {
            return res.status(400).json({ message: 'Nama pasien harus diisi' });
        }

        const [result] = await db.query(
            'INSERT INTO pasien (nama_pasien, jenis_kelamin, alamat, no_telp) VALUES (?, ?, ?, ?)',
            [nama_pasien, jenis_kelamin, alamat, no_telp]
        );

        res.status(201).json({
            message: 'Pasien berhasil ditambahkan',
            id_pasien: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Update pasien
exports.updatePasien = async (req, res) => {
    try {
        const { nama_pasien, jenis_kelamin, alamat, no_telp } = req.body;

        const [result] = await db.query(
            'UPDATE pasien SET nama_pasien = ?, jenis_kelamin = ?, alamat = ?, no_telp = ? WHERE id_pasien = ?',
            [nama_pasien, jenis_kelamin, alamat, no_telp, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        res.json({ message: 'Pasien berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Delete pasien
exports.deletePasien = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM pasien WHERE id_pasien = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        res.json({ message: 'Pasien berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
