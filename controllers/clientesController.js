const clientesService = require('../services/clientesService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class ClientesController {

  // 🔍 Buscar clientes
  buscarClientes = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    const idCentro = req.user.idCentro;

    if (!q || q.trim().length < 2) {
      return next(
        new AppError('El texto de búsqueda debe tener al menos 2 caracteres', 400)
      );
    }

    const clientes = await clientesService.buscarClientes(q.trim(), idCentro);
    res.json(clientes);
  });

  // 📋 Obtener todos
  getAllClientes = catchAsync(async (req, res) => {
    const clientes = await clientesService.getAllClientes(req.user.idCentro);
    res.json(clientes);
  });

  // 📊 Listado con última sesión
  getClientesListado = catchAsync(async (req, res) => {
    const clientes = await clientesService.getClientesConUltimaSesion(req.user.idCentro);
    res.json(clientes);
  });

  // 👤 Obtener por ID
  getClienteById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const cliente = await clientesService.getClienteById(id, idCentro);

    if (!cliente) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.json(cliente);
  });

  // ➕ Crear
  createCliente = catchAsync(async (req, res) => {
    const idCentro = req.user.idCentro;

    const newCliente = await clientesService.createCliente({
      ...req.body,
      idCentro
    });

    res.status(201).json(newCliente);
  });

  // ✏️ Actualizar
  updateCliente = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const clienteActualizado = await clientesService.updateCliente(
      id,
      { ...req.body },
      idCentro
    );

    if (!clienteActualizado) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.json(clienteActualizado);
  });

  // 🗑️ Eliminar
  deleteCliente = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const eliminado = await clientesService.deleteCliente(id, idCentro);

    if (!eliminado) {
      return next(new AppError('Cliente no encontrado', 404));
    }

    res.status(204).send();
  });

  // 📚 Historial
  getHistorialSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de cliente inválido', 400));
    }

    const sesiones = await clientesService.getHistorialSesiones(id, idCentro);
    res.json(sesiones);
  });

}

module.exports = new ClientesController();