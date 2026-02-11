// controllers/sesionesController.js
const sesionesService = require('../services/sesionesService');
const { validarCrearSesion } = require('../validators/sesiones.validator');

class SesionesController {

  async getAllSesiones(req, res) {
    try {
      const sesiones = await sesionesService.getAllSesiones();
      res.json(sesiones);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getSesionById(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID de sesión inválido' });
    }

    try {
      const sesion = await sesionesService.getSesionesById(id);
      if (!sesion) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      res.json(sesion);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createSesion(req, res) {
    try {
      const nuevaSesion = await sesionesService.createSesion(req.body);
      res.status(201).json(nuevaSesion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async createSesionCompleta(req, res) {
    const errores = validarCrearSesion(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const sesion = await sesionesService.createSesionCompleta(req.body);
      res.status(201).json(sesion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async updateSesion(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID de sesión inválido' });
    }

    try {
      const sesionActualizada = await sesionesService.updateSesiones(id, req.body);
      if (!sesionActualizada) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      res.json(sesionActualizada);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteSesion(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID de sesión inválido' });
    }

    try {
      const deleted = await sesionesService.deleteSesiones(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getDetalleSesion(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID de sesión inválido' });
    }

    try {
      const detalle = await sesionesService.getDetalleSesion(id);
      if (!detalle) {
        return res.status(404).json({ message: 'Sesión no encontrada' });
      }
      res.json(detalle);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new SesionesController();
