const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obatController');
const auth = require('../middleware/auth');

router.get('/', auth, obatController.getAllObat);
router.get('/expired', auth, obatController.getObatExpired);
router.get('/kritis', auth, obatController.getObatKritis);
router.get('/:id', auth, obatController.getObatById);
router.post('/', auth, obatController.createObat);
router.put('/:id', auth, obatController.updateObat);
router.delete('/:id', auth, obatController.deleteObat);

module.exports = router;
