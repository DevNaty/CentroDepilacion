// app.js
const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();

const errorMiddleware = require('./src/middlewares/errorMiddleware');
const AppError = require('./src/appError');

// Rutas
const clientesRoutes = require('./routes/clientes');
const zonasRoutes = require('./routes/zonas');
const sesionesRoutes = require('./routes/sesiones');
const detallesSesionesRoutes = require('./routes/detallesSesiones');
const turnosRoutes = require('./routes/turnos');

const app = express();

// 1. Middlewares globales
app.use(express.json());

// 2. Conexión DB
connectDB();

// 3. Rutas
app.get('/', (req, res) => res.send('API de Centro de Depilación funcionando!'));

app.use('/api/clientes', clientesRoutes);
app.use('/api/zonas', zonasRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/detallesSesiones', detallesSesionesRoutes);
app.use('/api/turnos', turnosRoutes);

// 4. Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  next(new AppError(`No se encontró ${req.originalUrl} en este servidor`, 404));
});

// 5. Middleware de Errores (SIEMPRE AL FINAL)
app.use(errorMiddleware);

// 6. Encender servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

