const cors = require("cors");
const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');
const formatResponseDates = require('./src/middlewares/formatResponseDates');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const AppError = require('./src/appError');

// Rutas
const clientesRoutes = require('./routes/clientes');
const zonasRoutes = require('./routes/zonas');
const sesionesRoutes = require('./routes/sesiones');
const detallesSesionesRoutes = require('./routes/detallesSesiones');
const turnosRoutes = require('./routes/turnos');
const authRoutes = require('./routes/auth');

const app = express();


// 🔥 1️⃣ CORS PRIMERO
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// 🔥 2️⃣ JSON
app.use(express.json());

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Middleware para formatear fechas en las respuestas
app.use(formatResponseDates);
// DB
connectDB();

// Test
app.get('/', (req, res) =>
  res.send('API de Centro de Depilación funcionando!')
);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/zonas', zonasRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/detallesSesiones', detallesSesionesRoutes);
app.use('/api/turnos', turnosRoutes);

// 404
app.use((req, res, next) => {
  next(new AppError(`No se encontró ${req.originalUrl} en este servidor`, 404));
});

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});