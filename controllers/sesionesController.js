// controllers/sesionesController.js
const sesionesService = require('../services/sesionesService');
const { validarCrearSesion } = require('../validators/sesiones.validator');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class SesionesController {

  // GET /sesiones
  getAllSesiones = catchAsync(async (req, res) => {
    const sesiones = await sesionesService.getAllSesiones();
    res.json(sesiones);
  });

  // GET /sesiones/:id
  getSesionById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const sesion = await sesionesService.getSesionesById(id);

    if (!sesion) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(sesion);
  });

  // POST /sesiones
  createSesion = catchAsync(async (req, res, next) => {
    const { ID_Cliente, Fecha } = req.body;

    if (!ID_Cliente || !Number.isInteger(ID_Cliente)) {
      return next(new AppError('ID_Cliente es obligatorio y debe ser un número entero', 400));
    }

    if (!Fecha || isNaN(Date.parse(Fecha))) {
      return next(new AppError('Fecha inválida', 400));
    }

    const nuevaSesion = await sesionesService.createSesion(req.body);
    res.status(201).json(nuevaSesion);
  });

  // POST /sesiones/completa
  createSesionCompleta = catchAsync(async (req, res, next) => {
    const errores = validarCrearSesion(req.body);

    if (errores.length > 0) {
      return next(new AppError(errores.join(' | '), 400));
    }

    const sesion = await sesionesService.createSesionCompleta(req.body);
    res.status(201).json(sesion);
  });

  // PUT /sesiones/:id
  updateSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const sesionActualizada = await sesionesService.updateSesiones(id, req.body);

    if (!sesionActualizada) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(sesionActualizada);
  });

  // DELETE /sesiones/:id
  deleteSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const deleted = await sesionesService.deleteSesiones(id);

    if (!deleted) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.status(204).send();
  });

  // GET /sesiones/:id/detalle
  getDetalleSesion = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de sesión inválido', 400));
    }

    const detalle = await sesionesService.getDetalleSesion(id);

    if (!detalle) {
      return next(new AppError('Sesión no encontrada', 404));
    }

    res.json(detalle);
  });
}

module.exports = new SesionesController();
