/**
 * Jalankan sekali untuk membuat user admin:
 * node scripts/createAdmin.js
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/database');
require('dotenv').config();

async function createAdmin() {
    const username = 'admin';
    const password = 'admin135';
    const level    = 'admin';

    const hash = await bcrypt.hash(password, 10);

    try {
        // Hapus admin lama jika ada
        await db.query('DELETE FROM user WHERE username = ?', [username]);
        const [result] = await db.query(
            'INSERT INTO user (username, password, level) VALUES (?, ?, ?)',
            [username, hash, level]
        );
        console.log(`✅ Admin berhasil dibuat (id: ${result.insertId})`);
        console.log(`   Username : ${username}`);
        console.log(`   Password : ${password}`);
    } catch (err) {
        console.error('❌ Gagal:', err.message);
    } finally {
        process.exit();
    }
}

createAdmin();
