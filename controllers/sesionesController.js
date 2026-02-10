// controllers/clienteController.js
const SesionesService = require('../services/SesionesService');
const { validarCrearSesion } = require("../validators/sesiones.validator");

class SesionesController {
    async getAllSesiones(req, res) {
        try {
            const Sesiones = await SesionesService.getAllSesiones();
            res.json(Sesiones);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getSesionesById(req, res) {
        try {
            const SesionesID = await SesionesService.getSesionesById(req.params.id);
            if (SesionesID) {
                res.json(SesionesID);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createSesiones(req, res) {
        try {
            const newSesiones = await SesionesService.createSesiones(req.body);
            res.status(201).json(newSesiones);
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
      const sesion = await SesionesService.createSesionCompleta(req.body);
      res.status(201).json(sesion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

    async updateSesiones(req, res) {
        try {
            const updateSesiones = await SesionesService.updateSesiones(req.params.id, req.body);
            if (updateSesiones) {
                res.json(updateSesiones);
            } else {
                res.status(404).json({ message: 'Sesion no encontrada' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteSesiones(req, res) {
        try {
            const deleted = await SesionesService.deleteSesiones(req.params.id);
            if (deleted) {
                res.status(204).send(); // No Content
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new SesionesController();