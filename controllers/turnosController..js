// controllers/clienteController.js
const TurnosService = require('../services/turnosService');

class TurnosController {
    async getAllTurnos(req, res) {
        try {
            const turnos = await TurnosService.getAllTurnos();
            res.json(turnos);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTurnoById(req, res) {
        try {
            const turnosID = await TurnosService.getTurnoById(req.params.id);
            if (turnosID) {
                res.json(turnosID);
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createTurno(req, res) {
        try {
            const newTurno = await TurnosService.createTurno(req.body);
            res.status(201).json(newTurno);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateTurno(req, res) {
        try {
            const updateTurno = await TurnosService.updateTurno(req.params.id, req.body);
            if (updateTurno) {
                res.json(updateTurno);
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteTurno(req, res) {
        try {
            const deleted = await TurnosService.deleteTurno(req.params.id);
            if (deleted) {
                res.status(204).send(); // No Content
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new TurnosController();