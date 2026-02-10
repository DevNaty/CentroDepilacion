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
    const clientes = await clientesService.buscarClientes(q);
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
        try {
            const cliente = await clientesService.getClienteById(req.params.id);
            if (cliente) {
                res.json(cliente);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
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
        try {
            const updatedCliente = await clientesService.updateCliente(req.params.id, req.body);
            if (updatedCliente) {
                res.json(updatedCliente);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteCliente(req, res) {
        try {
            const deleted = await clientesService.deleteCliente(req.params.id);
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

module.exports = new ClientesController();