
const detallesSesionesService = require('../services/detallesSesionesService');

class DetallesSesionesController {
    async getAllDetallesSesiones(req, res) {
        try {
            const detallesSesiones = await detallesSesionesService.getAllDetallesSesiones();
            res.json(detallesSesiones);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getDetallesSesionesById(req, res) {
        try {
            const detallesSesionesID = await detallesSesionesService.getDetallesSesionesById(req.params.id);
            if (detallesSesionesID) {
                res.json(detallesSesionesID);
            } else {
                res.status(404).json({ message: 'Det. Sesiones no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createDetallesSesiones(req, res) {
        try {
            const newDetallesSesiones = await detallesSesionesService.createDetallesSesiones(req.body);
            res.status(201).json(newDetallesSesiones);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateDetallesSesiones(req, res) {
        try {
            const updateDetallesSesiones = await detallesSesionesService.updateDetallesSesiones(req.params.id, req.body);
            if (updateDetallesSesiones) {
                res.json(updateDetallesSesiones);
            } else {
                res.status(404).json({ message: 'Det. Sesiones no encontrado' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

   async deleteDetallesSesiones(req, res) {
        try {
            const deleted = await detallesSesionesService.deleteDetallesSesiones(req.params.id);
            if (deleted) {
                res.status(204).send(); // No Content
            } else {
                res.status(404).json({ message: 'Det. Sesiones no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
   /*async deleteDetallesSesiones(id) {
    const request = new sql.Request();
    request.input('ID_DetalleSesion', sql.Int, id);

    const result = await request.query(`
        DELETE FROM DetallesSesiones
        WHERE ID_DetalleSesion = @ID_DetalleSesion
    `);

    return result.rowsAffected[0] > 0;
}*/



}

module.exports = new DetallesSesionesController();