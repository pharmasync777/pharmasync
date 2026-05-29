const db = require('../config/database');

// Get semua supplier
exports.getAllSupplier = async (req, res) => {
    try {
        const [supplier] = await db.query('SELECT * FROM supplier ORDER BY nama_supplier');
        res.json(supplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const [supplier] = await db.query('SELECT * FROM supplier WHERE id_supplier = ?', [req.params.id]);
        
        if (supplier.length === 0) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan' });
        }
        
        res.json(supplier[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Tambah supplier
exports.createSupplier = async (req, res) => {
    try {
        const { nama_supplier, alamat, no_telp } = req.body;

        if (!nama_supplier) {
            return res.status(400).json({ message: 'Nama supplier harus diisi' });
        }

        const [result] = await db.query(
            'INSERT INTO supplier (nama_supplier, alamat, no_telp) VALUES (?, ?, ?)',
            [nama_supplier, alamat, no_telp]
        );

        res.status(201).json({
            message: 'Supplier berhasil ditambahkan',
            id_supplier: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
    try {
        const { nama_supplier, alamat, no_telp } = req.body;

        const [result] = await db.query(
            'UPDATE supplier SET nama_supplier = ?, alamat = ?, no_telp = ? WHERE id_supplier = ?',
            [nama_supplier, alamat, no_telp, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan' });
        }

        res.json({ message: 'Supplier berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM supplier WHERE id_supplier = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan' });
        }

        res.json({ message: 'Supplier berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
