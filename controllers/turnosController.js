// controllers/turnosController.js
const turnosService = require('../services/turnosService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class TurnosController {

  // GET /turnos
  getAllTurnos = catchAsync(async (req, res) => {
    const turnos = await turnosService.getAllTurnos();
    res.json(turnos);
  });

  // GET /turnos/vista
  getTurnosVista = catchAsync(async (req, res) => {
    const turnos = await turnosService.getTurnosVista();
    res.json(turnos);
  });

  // GET /turnos/:id
  getTurnoById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno = await turnosService.getTurnoById(id);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  // GET /turnos/:id/vista
  getTurnoByIdVista = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno = await turnosService.getTurnoByIdVista(id);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  // POST /turnos
  createTurno = catchAsync(async (req, res) => {
    const newTurno = await turnosService.createTurno(req.body);
    res.status(201).json(newTurno);
  });

  // PUT /turnos/:id
  updateTurno = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const turno = await turnosService.updateTurno(id, req.body);

    if (!turno) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.json(turno);
  });

  // DELETE /turnos/:id
  deleteTurno = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de turno inválido', 400));
    }

    const deleted = await turnosService.deleteTurno(id);

    if (!deleted) {
      return next(new AppError('Turno no encontrado', 404));
    }

    res.status(204).send();
  });
}

module.exports = new TurnosController();
