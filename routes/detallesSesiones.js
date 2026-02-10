const express = require('express');
const detallesSesionesController = require('../controllers/detallesSesionesController');
const router = express.Router();

router.get('/', detallesSesionesController.getAllDetallesSesiones);
router.get('/:id', detallesSesionesController.getDetallesSesionesById);
router.post('/', detallesSesionesController.createDetallesSesiones);
router.put('/:id', detallesSesionesController.updateDetallesSesiones);
router.delete('/:id', detallesSesionesController.deleteDetallesSesiones);

module.exports = router;