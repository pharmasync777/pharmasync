const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const auth = require('../middleware/auth');

router.get('/', auth, transaksiController.getAllTransaksi);
router.post('/', auth, transaksiController.createTransaksi);
router.delete('/:id', auth, transaksiController.deleteTransaksi);

module.exports = router;
