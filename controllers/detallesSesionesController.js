const detallesSesionesService = require('../services/detallesSesionesService');

class DetallesSesionesController {

    async getAllDetallesSesiones(req, res) {
        try {
            const detalles = await detallesSesionesService.getAllDetallesSesiones();
            res.json(detalles);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getDetallesSesionesById(req, res) {
        try {
            const { id } = req.params;
            const detalle = await detallesSesionesService.getDetallesSesionesById(id);

            if (!detalle) {
                return res.status(404).json({ message: 'Detalle de sesión no encontrado' });
            }

            res.json(detalle);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createDetallesSesiones(req, res) {
        try {
            const nuevoDetalle = await detallesSesionesService.createDetallesSesiones(req.body);
            res.status(201).json(nuevoDetalle);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateDetallesSesiones(req, res) {
        try {
            const { id } = req.params;
            const detalleActualizado = await detallesSesionesService.updateDetallesSesiones(id, req.body);

            if (!detalleActualizado) {
                return res.status(404).json({ message: 'Detalle de sesión no encontrado' });
            }

            res.json(detalleActualizado);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteDetallesSesiones(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await detallesSesionesService.deleteDetallesSesiones(id);

            if (!eliminado) {
                return res.status(404).json({ message: 'Detalle de sesión no encontrado' });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new DetallesSesionesController();
