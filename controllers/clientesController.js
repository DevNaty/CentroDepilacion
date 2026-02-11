// controllers/clientesController.js
const clientesService = require('../services/clientesService');

class ClientesController {

  async buscarClientes(req, res) {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        message: "El texto de búsqueda debe tener al menos 2 caracteres"
      });
    }

    try {
      const clientes = await clientesService.buscarClientes(q.trim());
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllClientes(req, res) {
    try {
      const clientes = await clientesService.getAllClientes();
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getClientesListado(req, res) {
    try {
      const clientes = await clientesService.getClientesConUltimaSesion();
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getClienteById(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    try {
      const cliente = await clientesService.getClienteById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(cliente);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createCliente(req, res) {
    try {
      const newCliente = await clientesService.createCliente(req.body);
      res.status(201).json(newCliente);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateCliente(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    try {
      const updatedCliente = await clientesService.updateCliente(id, req.body);
      if (!updatedCliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(updatedCliente);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteCliente(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    try {
      const deleted = await clientesService.deleteCliente(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getHistorialSesiones(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    try {
      const sesiones = await clientesService.getHistorialSesiones(id);
      res.json(sesiones);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ClientesController();
