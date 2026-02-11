// controllers/zonasController.js
const zonasService = require('../services/zonasService');

class ZonasController {
    async getAllZonas(req, res) {
        try {
            const zonas = await zonasService.getAllZonas();
            res.json(zonas);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getZonaById(req, res) {
        try {
            const zona = await zonasService.getZonaById(req.params.id);
            if (zona) {
                res.json(zona);
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createZona(req, res) {
        try {
            const newZona = await zonasService.createZona(req.body);
            res.status(201).json(newZona);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateZona(req, res) {
        try {
            const updatedZona = await zonasService.updateZona(req.params.id, req.body);
            if (updatedZona) {
                res.json(updatedZona);
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteZona(req, res) {
        try {
            const deleted = await zonasService.deleteZona(req.params.id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Zona no encontrada' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new ZonasController();
