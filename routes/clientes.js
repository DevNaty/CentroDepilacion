// routes/clientesRoutes.js
const express = require('express');
const clientesController = require('../controllers/clientesController');
const router = express.Router();

router.get("/buscar", clientesController.buscarClientes);
router.get('/', clientesController.getAllClientes);
router.get('/listado', clientesController.getClientesListado);
router.get('/:id', clientesController.getClienteById);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);
router.get("/:id/sesiones", clientesController.getHistorialSesiones);


module.exports = router;