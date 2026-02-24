// routes/detallesSesiones.js
const express = require('express');
const detallesSesionesController = require('../controllers/detallesSesionesController');

const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');
const { route } = require('./auth');

/**
 * @swagger
 * tags:
 *   name: DetallesSesiones
 *   description: Gestión de detalles de sesiones
 */
router.use(authMiddleware);

/**
 * @swagger
 * /api/detallesSesiones:
 *   get:
 *     summary: Obtener todos los detalles de sesiones
 *     tags: [DetallesSesiones]
 *     responses:
 *       200:
 *         description: Lista de detalles de sesiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleSesion'
 */
router.get('/', detallesSesionesController.getAllDetallesSesiones);
/**
 * @swagger
 * /api/detallesSesiones/sesion/{idSesion}:
 *   get:
 *     summary: Obtener los detalles de una sesión por ID de sesión
 *     tags: [DetallesSesiones]
 *     parameters:
 *       - in: path
 *         name: idSesion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Lista de detalles de la sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleSesion'
 *       400:
 *         description: ID de sesión inválido
 *       404:
 *         description: No se encontraron detalles para la sesión
 */
router.get('/sesion/:idSesion', detallesSesionesController.getDetallesBySesion);
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
 *         description: ID del detalle de sesión
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleSesion'
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
 *             $ref: '#/components/schemas/DetalleSesionInput'
 *     responses:
 *       201:
 *         description: Detalle creado correctamente
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
 *             $ref: '#/components/schemas/DetalleSesionInput'
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *       404:
 *         description: Detalle no encontrado
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
 *         description: Detalle eliminado correctamente
 *       404:
 *         description: Detalle no encontrado
 */
router.delete('/:id', detallesSesionesController.deleteDetallesSesiones);

module.exports = router;
