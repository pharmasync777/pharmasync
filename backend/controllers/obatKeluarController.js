const db = require('../config/database');

// Get semua obat keluar
exports.getAllObatKeluar = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT ok.*, o.nama_obat, o.jenis_obat, u.username
            FROM obat_keluar ok
            JOIN obat o ON ok.id_obat = o.id_obat
            JOIN user u ON ok.id_user = u.id_user
            ORDER BY ok.tanggal_keluar DESC
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Tambah obat keluar
exports.createObatKeluar = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { id_obat, jumlah_keluar, tanggal_keluar } = req.body;
        const id_user = req.user.id;

        if (!id_obat || !jumlah_keluar || !tanggal_keluar) {
            return res.status(400).json({ message: 'Data tidak lengkap' });
        }

        // Cek stok tersedia
        const [obat] = await conn.query('SELECT stok, stok_minimum FROM obat WHERE id_obat = ?', [id_obat]);

        if (obat.length === 0) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        if (obat[0].stok < jumlah_keluar) {
            return res.status(400).json({ message: 'Stok tidak mencukupi' });
        }

        // Insert ke tabel obat_keluar
        const [result] = await conn.query(
            'INSERT INTO obat_keluar (id_obat, id_user, jumlah_keluar, tanggal_keluar) VALUES (?, ?, ?, ?)',
            [id_obat, id_user, jumlah_keluar, tanggal_keluar]
        );

        // Kurangi stok obat
        await conn.query(
            'UPDATE obat SET stok = stok - ? WHERE id_obat = ?',
            [jumlah_keluar, id_obat]
        );

        // Cek apakah stok kritis setelah pengurangan
        const [updatedObat] = await conn.query('SELECT stok, stok_minimum, nama_obat FROM obat WHERE id_obat = ?', [id_obat]);
        const isKritis = updatedObat[0].stok <= updatedObat[0].stok_minimum;

        await conn.commit();

        res.status(201).json({
            message: 'Obat keluar berhasil dicatat',
            id_keluar: result.insertId,
            stok_kritis: isKritis,
            stok_sisa: updatedObat[0].stok,
            nama_obat: updatedObat[0].nama_obat
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};

// Delete obat keluar
exports.deleteObatKeluar = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [data] = await conn.query('SELECT * FROM obat_keluar WHERE id_keluar = ?', [req.params.id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        // Kembalikan stok
        await conn.query(
            'UPDATE obat SET stok = stok + ? WHERE id_obat = ?',
            [data[0].jumlah_keluar, data[0].id_obat]
        );

        await conn.query('DELETE FROM obat_keluar WHERE id_keluar = ?', [req.params.id]);

        await conn.commit();

        res.json({ message: 'Data obat keluar berhasil dihapus' });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};
