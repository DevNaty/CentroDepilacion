// routes/clienteRoutes.js
const express = require('express');
const SesionesController = require('../controllers/sesionesController');
const router = express.Router();

router.get('/', SesionesController.getAllSesiones);
router.get('/:id', SesionesController.getSesionesById);
router.post('/', SesionesController.createSesion);
router.post('/completa', SesionesController.createSesionCompleta);
router.put('/:id', SesionesController.updateSesiones);
router.delete('/:id', SesionesController.deleteSesiones);
router.get("/:id/detalles", SesionesController.getDetalleSesion);


module.exports = router;