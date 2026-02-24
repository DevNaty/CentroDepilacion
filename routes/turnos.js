// routes/turnosRoutes.js
const express = require('express');
const turnosController = require('../controllers/turnosController');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos del centro de depilación
 */
router.use(authMiddleware);
/**
 * @swagger
 * /api/turnos/vista:
 *   get:
 *     summary: Obtener listado de turnos en formato vista (con joins)
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos para visualización
 */
router.get('/vista', turnosController.getTurnosVista);

/**
 * @swagger
 * /api/turnos/{id}/vista:
 *   get:
 *     summary: Obtener un turno por ID en formato vista
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id/vista', turnosController.getTurnoByIdVista);

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', turnosController.getAllTurnos);

/**
 * @swagger
 * /api/turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id', turnosController.getTurnoById);

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Cliente
 *               - Fecha
 *               - Hora
 *             properties:
 *               ID_Cliente:
 *                 type: integer
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Hora:
 *                 type: string
 *               Estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado
 */
router.post('/', turnosController.createTurno);

/**
 * @swagger
 * /api/turnos/{id}:
 *   put:
 *     summary: Actualizar un turno
 *     tags: [Turnos]
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
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Hora:
 *                 type: string
 *               Estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Turno actualizado
 *       404:
 *         description: Turno no encontrado
 */
router.put('/:id', turnosController.updateTurno);

/**
 * @swagger
 * /api/turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Turno eliminado
 *       404:
 *         description: Turno no encontrado
 */
router.delete('/:id', turnosController.deleteTurno);

module.exports = router;
