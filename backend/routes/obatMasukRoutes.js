const express = require('express');
const router = express.Router();
const obatMasukController = require('../controllers/obatMasukController');
const auth = require('../middleware/auth');

router.get('/', auth, obatMasukController.getAllObatMasuk);
router.post('/', auth, obatMasukController.createObatMasuk);
router.delete('/:id', auth, obatMasukController.deleteObatMasuk);

module.exports = router;
