const detallesSesionesService = require('../services/detallesSesionesService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class DetallesSesionesController {

  getAllDetallesSesiones = catchAsync(async (req, res) => {
    const detalles = await detallesSesionesService.getAllDetallesSesiones(
      req.user.idCentro
    );
    res.json(detalles);
  });

  getDetallesSesionesById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const detalle = await detallesSesionesService.getDetalleSesionById(id, idCentro);

    if (!detalle) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.json(detalle);
  });

  getDetallesBySesion = catchAsync(async (req, res, next) => {
    const idSesion = Number(req.params.idSesion);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(idSesion)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const detalles =
      await detallesSesionesService.getDetallesBySesion(idSesion, idCentro);

    res.json(detalles);
  });

  createDetallesSesiones = catchAsync(async (req, res, next) => {
    const idCentro = req.user.idCentro;

    const nuevoDetalle =
      await detallesSesionesService.createDetalleSesion(
        req.body,
        idCentro
      );

    res.status(201).json(nuevoDetalle);
  });

  updateDetallesSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const detalleActualizado =
      await detallesSesionesService.updateDetalleSesion(
        id,
        req.body,
        idCentro
      );

    if (!detalleActualizado) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.json(detalleActualizado);
  });

  deleteDetallesSesiones = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de detalle de sesión inválido', 400));
    }

    const eliminado =
      await detallesSesionesService.deleteDetalleSesion(id, idCentro);

    if (!eliminado) {
      return next(new AppError('Detalle de sesión no encontrado', 404));
    }

    res.status(204).send();
  });
}

module.exports = new DetallesSesionesController();