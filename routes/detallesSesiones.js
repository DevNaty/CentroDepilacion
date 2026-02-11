const express = require('express');
const detallesSesionesController = require('../controllers/detallesSesionesController');

const router = express.Router();

// Obtener todos los detalles de sesiones
router.get('/', detallesSesionesController.getAllDetallesSesiones);

// Obtener un detalle de sesión por ID
router.get('/:id', detallesSesionesController.getDetallesSesionesById);

// Crear un nuevo detalle de sesión
router.post('/', detallesSesionesController.createDetallesSesiones);

// Actualizar un detalle de sesión
router.put('/:id', detallesSesionesController.updateDetallesSesiones);

// Eliminar un detalle de sesión
router.delete('/:id', detallesSesionesController.deleteDetallesSesiones);

module.exports = router;
