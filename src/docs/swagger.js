const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Centro de Depilación',
      version: '1.0.0',
      description: 'Documentación de la API para gestión de clientes, sesiones y turnos'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['./routes/*.js'] // 🔥 importante
};

module.exports = swaggerJsdoc(options);
