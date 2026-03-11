const sesionesService = require('../services/sesionesService');
const { validarCrearSesion } = require('../validators/sesiones.validator');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class SesionesController {

  getAllSesiones = catchAsync(async (req, res) => {
    const sesiones = await sesionesService.getAllSesiones(req.user.idCentro);
    res.json(sesiones);
  });

  getSesionById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const sesion = await sesionesService.getSesionesById(id, idCentro);

    if (!sesion) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(sesion);
  });

  /*createSesion = catchAsync(async (req, res, next) => {
    const { ID_Cliente, Fecha } = req.body;
    const idCentro = req.user.idCentro;

    if (!ID_Cliente || !Number.isInteger(ID_Cliente)) {
      return next(new AppError('ID_Cliente inválido', 400));
    }

    if (!Fecha || isNaN(Date.parse(Fecha))) {
      return next(new AppError('Fecha inválida', 400));
    }

    const nuevaSesion =
      await sesionesService.createSesion(req.body, idCentro);

    res.status(201).json(nuevaSesion);
  });
*/
  createSesionCompleta = catchAsync(async (req, res, next) => {
    
    console.log("BODY RECIBIDO:", req.body);
    console.log("USER:", req.user);
    const errores = validarCrearSesion(req.body);
    const idCentro = req.user.idCentro;

    if (errores.length > 0) {
      return next(new AppError(errores.join(' | '), 400));
    }

    const sesion =
      await sesionesService.createSesionCompleta(req.body, idCentro);

    res.status(201).json(sesion);
  });

  updateSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const sesionActualizada =
      await sesionesService.updateSesiones(id, req.body, idCentro);

    if (!sesionActualizada) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(sesionActualizada);
  });

  deleteSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const deleted =
      await sesionesService.deleteSesiones(id, idCentro);

    if (!deleted) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.status(204).send();
  });

  getDetalleSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const detalle =
      await sesionesService.getDetalleSesion(id, idCentro);

    if (!detalle) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(detalle);
  });
}

module.exports = new SesionesController();