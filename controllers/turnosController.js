const turnosService = require('../services/turnosService');

class TurnosController {

  async getAllTurnos(req, res) {
    try {
      const turnos = await turnosService.getAllTurnos();
      res.json(turnos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getTurnosVista(req, res) {
    try {
      const turnos = await turnosService.getTurnosVista();
      res.json(turnos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getTurnoById(req, res) {
    try {
      const turno = await turnosService.getTurnoById(req.params.id);
      if (!turno) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
      res.json(turno);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getTurnoByIdVista(req, res) {
    try {
      const turno = await turnosService.getTurnoByIdVista(req.params.id);
      if (!turno) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
      res.json(turno);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createTurno(req, res) {
    try {
      const newTurno = await turnosService.createTurno(req.body);
      res.status(201).json(newTurno);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateTurno(req, res) {
    try {
      const turno = await turnosService.updateTurno(req.params.id, req.body);
      if (!turno) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
      res.json(turno);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteTurno(req, res) {
    try {
      const deleted = await turnosService.deleteTurno(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new TurnosController();
