// controllers/detallesSesionesController.js
const detallesSesionesService = require('../services/detallesSesionesService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class DetallesSesionesController {

  // GET /detalles-sesiones
  getAllDetallesSesiones = catchAsync(async (req, res) => {
    const detalles = await detallesSesionesService.getAllDetallesSesiones();
    res.json(detalles);
  });

  // GET /detalles-sesiones/:id
  getDetallesSesionesById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const detalle = await detallesSesionesService.getDetallesSesionesById(id);

    if (!detalle) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.json(detalle);
  });

  // GET /detalles-sesiones/sesion/:idSesion
getDetallesBySesion = catchAsync(async (req, res, next) => {
  const idSesion = Number(req.params.idSesion);

  if (!Number.isInteger(idSesion)) {
    return next(new AppError('ID de sesión inválido', 400));
  }

  const detalles =
    await detallesSesionesService.getDetallesBySesion(idSesion);

  res.json(detalles);
});


  // POST /detalles-sesiones
  createDetallesSesiones = catchAsync(async (req, res) => {
    const nuevoDetalle = await detallesSesionesService.createDetallesSesiones(req.body);
    res.status(201).json(nuevoDetalle);
  });

  // PUT /detalles-sesiones/:id
  updateDetallesSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const detalleActualizado = await detallesSesionesService.updateDetallesSesiones(id, req.body);

    if (!detalleActualizado) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.json(detalleActualizado);
  });

  // DELETE /detalles-sesiones/:id
  deleteDetallesSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const eliminado = await detallesSesionesService.deleteDetallesSesiones(id);

    if (!eliminado) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.status(204).send();
  });
}

module.exports = new DetallesSesionesController();
