// routes/clientesRoutes.js
const express = require('express');
const clientesController = require('../controllers/clientesController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', clientesController.getAllClientes);

/**
 * @swagger
 * /api/clientes/buscar:
 *   get:
 *     summary: Buscar clientes por texto
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Texto a buscar
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/buscar', clientesController.buscarClientes);

/**
 * @swagger
 * /api/clientes/listado:
 *   get:
 *     summary: Obtener clientes con última sesión
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Listado especial de clientes
 */
router.get('/listado', clientesController.getClientesListado);

/**
 * @swagger
 * /api/clientes/{id}/sesiones:
 *   get:
 *     summary: Obtener historial de sesiones de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de sesiones
 */
router.get('/:id/sesiones', clientesController.getHistorialSesiones);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', clientesController.getClienteById);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Apellido
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Email:
 *                 type: string
 *               Notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', clientesController.createCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', clientesController.updateCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
