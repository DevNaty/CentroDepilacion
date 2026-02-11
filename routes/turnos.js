const express = require('express');
const turnosController = require('../controllers/turnosController');
const router = express.Router();

router.get('/vista', turnosController.getTurnosVista);
router.get('/:id/vista', turnosController.getTurnoByIdVista);

router.get('/', turnosController.getAllTurnos);
router.get('/:id', turnosController.getTurnoById);

router.post('/', turnosController.createTurno);
router.put('/:id', turnosController.updateTurno);
router.delete('/:id', turnosController.deleteTurno);

module.exports = router;

