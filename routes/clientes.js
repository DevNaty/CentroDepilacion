// routes/clientesRoutes.js
const express = require('express');
const clientesController = require('../controllers/clientesController');
const router = express.Router();

// Búsqueda
router.get('/buscar', clientesController.buscarClientes);

// Listados especiales
router.get('/listado', clientesController.getClientesListado);

// Historial de sesiones de un cliente
router.get('/:id/sesiones', clientesController.getHistorialSesiones);

// Cliente por ID
router.get('/:id', clientesController.getClienteById);

// CRUD básico
router.get('/', clientesController.getAllClientes);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
