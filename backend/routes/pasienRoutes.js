const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const auth = require('../middleware/auth');

router.get('/', auth, pasienController.getAllPasien);
router.get('/:id', auth, pasienController.getPasienById);
router.post('/', auth, pasienController.createPasien);
router.put('/:id', auth, pasienController.updatePasien);
router.delete('/:id', auth, pasienController.deletePasien);

module.exports = router;
