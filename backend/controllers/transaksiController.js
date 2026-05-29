const db = require('../config/database');

// Get semua transaksi
exports.getAllTransaksi = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT t.*, o.nama_obat, o.harga, u.username, p.nama_pasien
            FROM transaksi t
            JOIN obat o ON t.id_obat = o.id_obat
            JOIN user u ON t.id_user = u.id_user
            JOIN pasien p ON t.id_pasien = p.id_pasien
            ORDER BY t.tanggal_transaksi DESC
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Buat transaksi baru
exports.createTransaksi = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { id_obat, id_pasien, jumlah, tanggal_transaksi } = req.body;
        const id_user = req.user.id;

        if (!id_obat || !id_pasien || !jumlah || !tanggal_transaksi) {
            return res.status(400).json({ message: 'Data tidak lengkap' });
        }

        // Cek stok dan harga
        const [obat] = await conn.query('SELECT stok, harga, stok_minimum, nama_obat FROM obat WHERE id_obat = ?', [id_obat]);

        if (obat.length === 0) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        if (obat[0].stok < jumlah) {
            return res.status(400).json({ message: 'Stok tidak mencukupi' });
        }

        const total_harga = obat[0].harga * jumlah;

        // Insert transaksi
        const [result] = await conn.query(
            'INSERT INTO transaksi (id_obat, id_user, id_pasien, tanggal_transaksi, jumlah, total_harga) VALUES (?, ?, ?, ?, ?, ?)',
            [id_obat, id_user, id_pasien, tanggal_transaksi, jumlah, total_harga]
        );

        // Insert ke obat_keluar
        await conn.query(
            'INSERT INTO obat_keluar (id_obat, id_user, id_transaksi, jumlah_keluar, tanggal_keluar) VALUES (?, ?, ?, ?, ?)',
            [id_obat, id_user, result.insertId, jumlah, tanggal_transaksi]
        );

        // Kurangi stok
        await conn.query(
            'UPDATE obat SET stok = stok - ? WHERE id_obat = ?',
            [jumlah, id_obat]
        );

        // Cek stok kritis
        const [updatedObat] = await conn.query('SELECT stok, stok_minimum FROM obat WHERE id_obat = ?', [id_obat]);
        const isKritis = updatedObat[0].stok <= updatedObat[0].stok_minimum;

        await conn.commit();

        res.status(201).json({
            message: 'Transaksi berhasil dicatat',
            id_transaksi: result.insertId,
            total_harga,
            stok_kritis: isKritis,
            stok_sisa: updatedObat[0].stok,
            nama_obat: obat[0].nama_obat
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};

// Delete transaksi
exports.deleteTransaksi = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [data] = await conn.query('SELECT * FROM transaksi WHERE id_transaksi = ?', [req.params.id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        // Kembalikan stok
        await conn.query(
            'UPDATE obat SET stok = stok + ? WHERE id_obat = ?',
            [data[0].jumlah, data[0].id_obat]
        );

        // Hapus obat_keluar terkait
        await conn.query('DELETE FROM obat_keluar WHERE id_transaksi = ?', [req.params.id]);

        await conn.query('DELETE FROM transaksi WHERE id_transaksi = ?', [req.params.id]);

        await conn.commit();

        res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};
