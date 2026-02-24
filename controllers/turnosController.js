 const turnosService = require('../services/turnosService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class TurnosController {

  getAllTurnos = catchAsync(async (req, res) => {
    const turnos = await turnosService.getAllTurnos(req.user.idCentro);
    res.json(turnos);
  });

  getTurnosVista = catchAsync(async (req, res) => {
    const turnos = await turnosService.getTurnosVista(req.user.idCentro);
    res.json(turnos);
  });

  getTurnoById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno = await turnosService.getTurnoById(id, idCentro);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  getTurnoByIdVista = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno = await turnosService.getTurnoByIdVista(id, idCentro);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  createTurno = catchAsync(async (req, res, next) => {
    const idCentro = req.user.idCentro;

    const newTurno =
      await turnosService.createTurno(req.body, idCentro);

    if (!newTurno) {
      return next(new AppError('Cliente no pertenece al centro', 400));
    }

    res.status(201).json(newTurno);
  });

  updateTurno = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno =
      await turnosService.updateTurno(id, req.body, idCentro);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  deleteTurno = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);
    const idCentro = req.user.idCentro;

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const deleted =
      await turnosService.deleteTurno(id, idCentro);

    if (!deleted) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.status(204).send();
  });
}

module.exports = new TurnosController();