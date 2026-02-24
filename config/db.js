// config/db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    port: parseInt(process.env.DB_PORT, 10) || 1433 // Añadimos el port aquí, ya que lo tienes en el .env
};

// Renombramos la función aquí a connectDB
async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Conectado a la base de datos SQL Server'); // Puedes añadir un mensaje de éxito
        return pool; // Opcional: devolver el pool si lo necesitas en app.js
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        // Es importante que el servidor no inicie si no se conecta a la DB
        process.exit(1); // Esto cierra la aplicación si falla la conexión a la DB
    }
}

module.exports = {
    connectDB, // Ahora se exporta como connectDB
    sql
};
