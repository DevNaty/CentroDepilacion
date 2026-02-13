// middlewares/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log para el desarrollador (puedes usar Winston aquí en el futuro)
  console.error('❌ ERROR:', {
    message: err.message,
    stack: err.stack,
    sqlError: err.originalError // Por si viene de mssql
  });

  // Respuesta para el cliente
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Algo salió mal en el servidor'
  });
};

module.exports = errorMiddleware;