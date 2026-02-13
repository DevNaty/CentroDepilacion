// routes/detallesSesiones.js
const express = require('express');
const detallesSesionesController = require('../controllers/detallesSesionesController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DetallesSesiones
 *   description: Detalles de las zonas tratadas en una sesión
 */

/**
 * @swagger
 * /api/detallesSesiones:
 *   get:
 *     summary: Obtener todos los detalles de sesiones
 *     tags: [DetallesSesiones]
 *     responses:
 *       200:
 *         description: Lista de detalles de sesiones
 */
router.get('/', detallesSesionesController.getAllDetallesSesiones);

/**
 * @swagger
 * /api/detallesSesiones/{id}:
 *   get:
 *     summary: Obtener un detalle de sesión por ID
 *     tags: [DetallesSesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de sesión encontrado
 *       404:
 *         description: Detalle de sesión no encontrado
 */
router.get('/:id', detallesSesionesController.getDetallesSesionesById);

/**
 * @swagger
 * /api/detallesSesiones:
 *   post:
 *     summary: Crear un nuevo detalle de sesión
 *     tags: [DetallesSesiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Sesion
 *               - ID_Zona
 *               - Potencia
 *             properties:
 *               ID_Sesion:
 *                 type: integer
 *               ID_Zona:
 *                 type: integer
 *               Potencia:
 *                 type: string
 *               Notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Detalle de sesión creado
 */
router.post('/', detallesSesionesController.createDetallesSesiones);

/**
 * @swagger
 * /api/detallesSesiones/{id}:
 *   put:
 *     summary: Actualizar un detalle de sesión
 *     tags: [DetallesSesiones]
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
 *               ID_Sesion:
 *                 type: integer
 *               ID_Zona:
 *                 type: integer
 *               Potencia:
 *                 type: string
 *               Notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Detalle de sesión actualizado
 *       404:
 *         description: Detalle de sesión no encontrado
 */
router.put('/:id', detallesSesionesController.updateDetallesSesiones);

/**
 * @swagger
 * /api/detallesSesiones/{id}:
 *   delete:
 *     summary: Eliminar un detalle de sesión
 *     tags: [DetallesSesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Detalle de sesión eliminado
 *       404:
 *         description: Detalle de sesión no encontrado
 */
router.delete('/:id', detallesSesionesController.deleteDetallesSesiones);

module.exports = router;
