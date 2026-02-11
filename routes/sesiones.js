// routes/sesionesRoutes.js
const express = require('express');
const sesionesController = require('../controllers/sesionesController');
const router = express.Router();

// Detalle de una sesión (SIEMPRE antes que :id)
router.get('/:id/detalles', sesionesController.getDetalleSesion);

// CRUD sesiones
router.get('/', sesionesController.getAllSesiones);
router.get('/:id', sesionesController.getSesionById);
router.post('/', sesionesController.createSesion);
router.post('/completa', sesionesController.createSesionCompleta);
router.put('/:id', sesionesController.updateSesion);
router.delete('/:id', sesionesController.deleteSesion);

module.exports = router;
