// app.js
const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');

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

// 1️⃣ Middlewares globales
app.use(express.json());

// 2️⃣ Swagger (ANTES del 404)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3️⃣ DB
connectDB();

// 4️⃣ Rutas
app.get('/', (req, res) =>
  res.send('API de Centro de Depilación funcionando!')
);

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/zonas', zonasRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/detallesSesiones', detallesSesionesRoutes);
app.use('/api/turnos', turnosRoutes);

// 5️⃣ 404 GLOBAL (Express 5 ✔)
app.use((req, res, next) => {
  next(new AppError(`No se encontró ${req.originalUrl} en este servidor`, 404));
});

// 6️⃣ Error handler
app.use(errorMiddleware);

// 7️⃣ Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
setInterval(() => {
  // mantiene vivo el event loop
}, 1000);
