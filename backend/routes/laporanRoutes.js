const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, laporanController.getDashboardSummary);
router.get('/stok', auth, laporanController.getLaporanStok);
router.get('/expired', auth, laporanController.getLaporanExpired);
router.get('/transaksi', auth, laporanController.getLaporanTransaksi);

module.exports = router;
