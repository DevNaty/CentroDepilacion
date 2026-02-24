// routes/zonasRoutes.js
const express = require('express');
const zonasController = require('../controllers/zonasController');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');



/**
 * @swagger
 * tags:
 *   name: Zonas
 *   description: Gestión de zonas de depilación
 */
router.use(authMiddleware);
/**
 * @swagger
 * /api/zonas:
 *   get:
 *     summary: Obtener todas las zonas
 *     tags: [Zonas]
 *     responses:
 *       200:
 *         description: Lista de zonas
 */
router.get('/', zonasController.getAllZonas);

/**
 * @swagger
 * /api/zonas/{id}:
 *   get:
 *     summary: Obtener una zona por ID
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zona encontrada
 *       404:
 *         description: Zona no encontrada
 */
router.get('/:id', zonasController.getZonaById);

/**
 * @swagger
 * /api/zonas:
 *   post:
 *     summary: Crear una nueva zona
 *     tags: [Zonas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *             properties:
 *               Nombre:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zona creada
 */
router.post('/', zonasController.createZona);

/**
 * @swagger
 * /api/zonas/{id}:
 *   put:
 *     summary: Actualizar una zona
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zona actualizada
 *       404:
 *         description: Zona no encontrada
 */
router.put('/:id', zonasController.updateZona);

/**
 * @swagger
 * /api/zonas/{id}:
 *   delete:
 *     summary: Eliminar una zona
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Zona eliminada
 *       404:
 *         description: Zona no encontrada
 */
router.delete('/:id', zonasController.deleteZona);

module.exports = router;
