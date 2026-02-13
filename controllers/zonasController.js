// controllers/zonasController.js
const zonasService = require('../services/zonasService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class ZonasController {

  // GET /zonas
  getAllZonas = catchAsync(async (req, res) => {
    const zonas = await zonasService.getAllZonas();
    res.json(zonas);
  });

  // GET /zonas/:id
  getZonaById = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de zona inválido', 400));
    }

    const zona = await zonasService.getZonaById(id);

    if (!zona) {
      return next(new AppError('Zona no encontrada', 404));
    }

    res.json(zona);
  });

  // POST /zonas
  createZona = catchAsync(async (req, res) => {
    const newZona = await zonasService.createZona(req.body);
    res.status(201).json(newZona);
  });

  // PUT /zonas/:id
  updateZona = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de zona inválido', 400));
    }

    const updatedZona = await zonasService.updateZona(id, req.body);

    if (!updatedZona) {
      return next(new AppError('Zona no encontrada', 404));
    }

    res.json(updatedZona);
  });

  // DELETE /zonas/:id
  deleteZona = catchAsync(async (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return next(new AppError('ID de zona inválido', 400));
    }

    const deleted = await zonasService.deleteZona(id);

    if (!deleted) {
      return next(new AppError('Zona no encontrada', 404));
    }

    res.status(204).send();
  });
}

module.exports = new ZonasController();
