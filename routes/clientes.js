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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
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
 *         name: texto
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto a buscar (nombre, apellido, teléfono o email)
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_Cliente:
 *                     type: integer
 *                   Nombre:
 *                     type: string
 *                   Apellido:
 *                     type: string
 *                   Telefono:
 *                     type: string
 *                   UltimaSesion:
 *                     type: string
 *                     format: date
 *                   Zonas:
 *                     type: string
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
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Historial de sesiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_Sesion:
 *                     type: integer
 *                   Fecha:
 *                     type: string
 *                     format: date
 *                   CantidadZonas:
 *                     type: integer
 *       404:
 *         description: Cliente no encontrado
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
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
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
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', clientesController.createCliente);


/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Datos inválidos
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
 *         description: ID del cliente a eliminar
 *     responses:
 *       204:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', clientesController.deleteCliente);


module.exports = router;
