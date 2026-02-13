// routes/sesionesRoutes.js
const express = require('express');
const sesionesController = require('../controllers/sesionesController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sesiones
 *   description: Gestión de sesiones de depilación
 */

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Obtener todas las sesiones
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Lista de sesiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sesion'
 */
router.get('/', sesionesController.getAllSesiones);

/**
 * @swagger
 * /api/sesiones/{id}/detalles:
 *   get:
 *     summary: Obtener el detalle completo de una sesión (zonas tratadas)
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleSesion'
 *       404:
 *         description: Sesión no encontrada
 */
router.get('/:id/detalles', sesionesController.getDetalleSesion);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   get:
 *     summary: Obtener una sesión por ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sesion'
 *       404:
 *         description: Sesión no encontrada
 */
router.get('/:id', sesionesController.getSesionById);

/**
 * @swagger
 * /api/sesiones:
 *   post:
 *     summary: Crear una sesión simple
 *     tags: [Sesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Cliente
 *               - Fecha
 *             properties:
 *               ID_Cliente:
 *                 type: integer
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sesión creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sesion'
 */
router.post('/', sesionesController.createSesion);

/**
 * @swagger
 * /api/sesiones/completa:
 *   post:
 *     summary: Crear una sesión completa con zonas (transacción)
 *     tags: [Sesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Cliente
 *               - Fecha
 *               - Detalles
 *             properties:
 *               ID_Cliente:
 *                 type: integer
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Detalles:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DetalleSesionInput'
 *     responses:
 *       201:
 *         description: Sesión completa creada
 */
router.post('/completa', sesionesController.createSesionCompleta);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   put:
 *     summary: Actualizar una sesión
 *     tags: [Sesiones]
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
 *               ID_Cliente:
 *                 type: integer
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión actualizada
 *       404:
 *         description: Sesión no encontrada
 */
router.put('/:id', sesionesController.updateSesion);

/**
 * @swagger
 * /api/sesiones/{id}:
 *   delete:
 *     summary: Eliminar una sesión
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Sesión eliminada
 *       404:
 *         description: Sesión no encontrada
 */
router.delete('/:id', sesionesController.deleteSesion);

module.exports = router;
