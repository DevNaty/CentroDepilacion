// app.js
const express = require('express');
const { connectDB } = require('./config/db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const clientesRoutes = require('./routes/clientes');
const zonasRoutes = require('./routes/zonas');
const sesionesRoutes = require('./routes/sesiones');
const detallesSesionesRoutes = require('./routes/detallesSesiones');
const turnosRoutes = require('./routes/turnos');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de la API
app.use('/api/clientes', clientesRoutes);
app.use('/api/zonas', zonasRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/detallesSesiones', detallesSesionesRoutes);
app.use('/api/turnos',turnosRoutes);


// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('API de Centro de Depilación funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});