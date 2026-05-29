const db = require('../config/database');

// Get semua obat masuk
exports.getAllObatMasuk = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT om.*, o.nama_obat, o.jenis_obat, s.nama_supplier, u.username
            FROM obat_masuk om
            JOIN obat o ON om.id_obat = o.id_obat
            JOIN supplier s ON om.id_supplier = s.id_supplier
            JOIN user u ON om.id_user = u.id_user
            ORDER BY om.tanggal_masuk DESC
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Tambah obat masuk
exports.createObatMasuk = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { id_obat, id_supplier, jumlah_masuk, tanggal_masuk } = req.body;
        const id_user = req.user.id;

        if (!id_obat || !id_supplier || !jumlah_masuk || !tanggal_masuk) {
            return res.status(400).json({ message: 'Data tidak lengkap' });
        }

        // Insert ke tabel obat_masuk
        const [result] = await conn.query(
            'INSERT INTO obat_masuk (id_obat, id_supplier, id_user, jumlah_masuk, tanggal_masuk) VALUES (?, ?, ?, ?, ?)',
            [id_obat, id_supplier, id_user, jumlah_masuk, tanggal_masuk]
        );

        // Update stok obat
        await conn.query(
            'UPDATE obat SET stok = stok + ? WHERE id_obat = ?',
            [jumlah_masuk, id_obat]
        );

        await conn.commit();

        res.status(201).json({
            message: 'Obat masuk berhasil dicatat',
            id_masuk: result.insertId
        });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};

// Delete obat masuk
exports.deleteObatMasuk = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Ambil data sebelum dihapus untuk rollback stok
        const [data] = await conn.query('SELECT * FROM obat_masuk WHERE id_masuk = ?', [req.params.id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        // Kurangi stok kembali
        await conn.query(
            'UPDATE obat SET stok = stok - ? WHERE id_obat = ?',
            [data[0].jumlah_masuk, data[0].id_obat]
        );

        await conn.query('DELETE FROM obat_masuk WHERE id_masuk = ?', [req.params.id]);

        await conn.commit();

        res.json({ message: 'Data obat masuk berhasil dihapus' });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        conn.release();
    }
};
