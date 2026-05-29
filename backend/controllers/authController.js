const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password harus diisi' });
        }

        const [users] = await db.query('SELECT * FROM user WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const token = jwt.sign(
            { id: user.id_user, username: user.username, level: user.level },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id_user,
                username: user.username,
                level: user.level
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// Register (untuk membuat user baru)
exports.register = async (req, res) => {
    try {
        const { username, password, level } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password harus diisi' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO user (username, password, level) VALUES (?, ?, ?)',
            [username, hashedPassword, level || 'admin']
        );

        res.status(201).json({
            message: 'User berhasil dibuat',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};
