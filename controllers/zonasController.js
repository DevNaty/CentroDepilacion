// controllers/zonasController.js
const zonasService = require('../services/zonasService');
const catchAsync = require('../src/utils/catchAsync');
const AppError = require('../src/appError');

class ZonasController {

  // GET /zonas
getAllZonas = catchAsync(async (req, res) => {
  const zonas = await zonasService.getAllZonas(req.user.idCentro);
  res.json(zonas);
});

// GET /zonas/:id
getZonaById = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return next(new AppError('ID de zona inválido', 400));
  }

  const zona = await zonasService.getZonaById(id, req.user.idCentro);

  if (!zona) {
    return next(new AppError('Zona no encontrada', 404));
  }

  res.json(zona);
});

getZonaUltimaPotencia = catchAsync(async (req, res, next) => {
  const id = Number(req.query.idZona);
  const idCliente = Number(req.query.idCliente);

  if (!Number.isInteger(id) || !Number.isInteger(idCliente)) {
    return next(new AppError('Parámetros inválidos', 400));
  }

  const ultimaPotencia = await zonasService.getZonaUltimaPotencia(
    id,
    idCliente
  );

  if (!ultimaPotencia) {
    return res.json({ Potencia: null }); // 👈 importante
  }

  res.json(ultimaPotencia);
});

// POST /zonas
createZona = catchAsync(async (req, res, next) => {

  const idCentro = req.user.idCentro; // 👈 del JWT

  if (!idCentro) {
    return next(new AppError('Centro no definido en el token', 400));
  }

  const newZona = await zonasService.createZona(req.body, idCentro);

  res.status(201).json(newZona);
});


/*createZona = catchAsync(async (req, res) => {
  const newZona = await zonasService.createZona(
    req.body,
    req.user.idCentro
  );
  res.status(201).json(newZona);
});*/
// PUT /zonas/:id
updateZona = catchAsync(async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return next(new AppError('ID de zona inválido', 400));
  }

  const updatedZona = await zonasService.updateZona(
    id,
    req.body,
    req.user.idCentro
  );

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

  const deleted = await zonasService.deleteZona(
    id,
    req.user.idCentro
  );

  if (!deleted) {
    return next(new AppError('Zona no encontrada', 404));
  }

  res.status(204).send();
});


}

module.exports = new ZonasController();
