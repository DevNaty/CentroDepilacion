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
    ],

    components: {
  schemas: {

    Cliente: {
      type: 'object',
      properties: {
        ID_Cliente: { type: 'integer', example: 1 },
        Nombre: { type: 'string', example: 'Ana' },
        Apellido: { type: 'string', example: 'Gómez' },
        Telefono: { type: 'string', example: '3511234567' },
        Email: { type: 'string', example: 'ana@gmail.com' },
        Notas: { type: 'string', example: 'Prefiere turnos por la tarde' }
      }
    },

    Zona: {
      type: 'object',
      properties: {
        ID_Zona: { type: 'integer', example: 3 },
        Nombre_Zona: { type: 'string', example: 'Piernas completas' }
      }
    },

    Turno: {
      type: 'object',
      properties: {
        ID_Turno: { type: 'integer', example: 10 },
        Fecha: { type: 'string', format: 'date', example: '2026-02-10' },
        Hora: { type: 'string', example: '15:30' },
        ID_Cliente: { type: 'integer', example: 1 }
      }
    },

    Sesion: {
      type: 'object',
      properties: {
        ID_Sesion: { type: 'integer', example: 5 },
        Fecha: { type: 'string', format: 'date', example: '2026-02-01' },
        ID_Cliente: { type: 'integer', example: 1 }
      }
    },

    DetalleSesion: {
      type: 'object',
      properties: {
        ID_DetalleSesion: { type: 'integer', example: 12 },
        ID_Sesion: { type: 'integer', example: 5 },
        ID_Zona: { type: 'integer', example: 3 },
        Nombre_Zona: { type: 'string', example: 'Axilas' },
        Potencia: { type: 'string', example: '18J' },
        Notas: { type: 'string', nullable: true }
      }
    },

    DetalleSesionInput: {
      type: 'object',
      required: ['ID_Sesion', 'ID_Zona', 'Potencia'],
      properties: {
        ID_Sesion: { type: 'integer', example: 5 },
        ID_Zona: { type: 'integer', example: 3 },
        Potencia: { type: 'string', example: '18J' },
        Notas: { type: 'string', example: 'Piel sensible' }
      }
    }

  }
}
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
