const express = require('express');
const router = express.Router();
const obatKeluarController = require('../controllers/obatKeluarController');
const auth = require('../middleware/auth');

router.get('/', auth, obatKeluarController.getAllObatKeluar);
router.post('/', auth, obatKeluarController.createObatKeluar);
router.delete('/:id', auth, obatKeluarController.deleteObatKeluar);

module.exports = router;
