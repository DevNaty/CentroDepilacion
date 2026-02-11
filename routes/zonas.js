// routes/zonasRoutes.js
const express = require('express');
const zonasController = require('../controllers/zonasController');
const router = express.Router();

router.get('/', zonasController.getAllZonas);
router.get('/:id', zonasController.getZonaById);
router.post('/', zonasController.createZona);
router.put('/:id', zonasController.updateZona);
router.delete('/:id', zonasController.deleteZona);

module.exports = router;
