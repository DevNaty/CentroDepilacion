const clientesService = require('../services/clientesService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class ClientesController {

  // 🔍 Buscar clientes
  buscarClientes = catchAsync(async (req, res, next) => {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return next(
        new AppError('El texto de búsqueda debe tener al menos 2 caracteres', 400)
      );
    }

    const clientes = await clientesService.buscarClientes(q.trim());
    res.json(clientes);
  });

  // 📋 Obtener todos los clientes
  getAllClientes = catchAsync(async (req, res) => {
    const clientes = await clientesService.getAllClientes();
    res.json(clientes);
  });

  // 📊 Listado con última sesión
  getClientesListado = catchAsync(async (req, res) => {
    const clientes = await clientesService.getClientesConUltimaSesion();
    res.json(clientes);
  });

  // 👤 Obtener cliente por ID
  getClienteById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const cliente = await clientesService.getClienteById(id);

    if (!cliente) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.json(cliente);
  });

  // ➕ Crear cliente
  createCliente = catchAsync(async (req, res) => {
    const newCliente = await clientesService.createCliente(req.body);
    res.status(201).json(newCliente);
  });

  // ✏️ Actualizar cliente
  updateCliente = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const clienteActualizado = await clientesService.updateCliente(id, req.body);

    if (!clienteActualizado) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.json(clienteActualizado);
  });

  // 🗑️ Eliminar cliente
  deleteCliente = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const eliminado = await clientesService.deleteCliente(id);

    if (!eliminado) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.status(204).send();
  });

  // 📚 Historial de sesiones del cliente
  getHistorialSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const sesiones = await clientesService.getHistorialSesiones(id);
    res.json(sesiones);
  });

}

module.exports = new ClientesController();
