// services/sesionesService.js
const { sql } = require('../config/db');

class SesionesService {
    async getAllSesiones() {
        try {
            const result = await sql.query
            ('SELECT *  FROM Sesiones');
            return result.recordset;
        } catch (err) {
            throw new Error(`Error al obtener sesiones : ${err.message}`);
        }
    }

    async getSesionesById(id) {
        try {
            const result = await sql.query`SELECT * FROM Sesiones WHERE ID_Sesiones = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw new Error(`Error al obtener  sesion con ID ${id}: ${err.message}`);
        }
    }

    async createSesion(Sesion) {
        try {
            const { ID_Cliente, Notas, Fecha } =Sesion;
            const request = new sql.Request();
            request.input('ID_Cliente', sql.Int, ID_Cliente);
            request.input('Notas', sql.VarChar, Notas);
            request.input('Fecha', sql.Date, Fecha);
            

            const result = await request.query`
                INSERT INTO Sesiones (ID_Cliente, Notas, Fecha)
                VALUES (@ID_Cliente,  @Notas, @Fecha);
                SELECT SCOPE_IDENTITY() AS ID_Sesiones;
            `;
            return { ID_Sesiones: result.recordset[0].ID_Sesiones, ...Sesion };
        } catch (err) {
            throw new Error(`Error al crear sesion: ${err.message}`);
        }
    }

   async createSesionCompleta(data) {
    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    const { ID_Cliente, Fecha, Detalles } = data;

    if (!Detalles || Detalles.length === 0) {
      throw new Error('La sesión debe tener al menos una zona');
    }

    try {
      await transaction.begin();

      // 1️⃣ Crear sesión
      const sesionRequest = new sql.Request(transaction);
      sesionRequest.input('ID_Cliente', sql.Int, ID_Cliente);
      sesionRequest.input('Fecha', sql.Date, Fecha);

      const sesionResult = await sesionRequest.query(`
        INSERT INTO Sesiones (ID_Cliente, Fecha)
        VALUES (@ID_Cliente, @Fecha);
        SELECT SCOPE_IDENTITY() AS ID_Sesion;
      `);

      const ID_Sesion = sesionResult.recordset[0].ID_Sesion;

      // 2️⃣ Crear detalles
      for (const detalle of Detalles) {
        const detalleRequest = new sql.Request(transaction);
        detalleRequest.input('ID_Sesion', sql.Int, ID_Sesion);
        detalleRequest.input('ID_Zona', sql.Int, detalle.ID_Zona);
        detalleRequest.input('Potencia', sql.VarChar, detalle.Potencia);
        detalleRequest.input('Notas', sql.VarChar, detalle.Notas || null);

        await detalleRequest.query(`
          INSERT INTO DetallesSesiones (ID_Sesion, ID_Zona, Potencia, Notas)
          VALUES (@ID_Sesion, @ID_Zona, @Potencia, @Notas);
        `);
      }

      await transaction.commit();

      return {
        ID_Sesion,
        ID_Cliente,
        Fecha,
        Detalles
      };

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

    async updateSesiones(id, Sesion) {
        try {
            const { ID_Cliente, Notas, Fecha } =Sesion;
            const request = new sql.Request();
            request.input('ID_Sesion', sql.Int, id);
            request.input('ID_Cliente', sql.Int, ID_Cliente);
          
            request.input('Fecha', sql.Date, Fecha);

            const result = await request.query`
                UPDATE Sesiones
                SET ID_Cliente = @ID_Cliente, Fecha = @Fecha
                WHERE ID_Sesion = @ID_Sesion;
                `;
            if (result.rowsAffected[0] === 0) {
                return null; 
            }
            return { ID_Sesion: id, ...Sesion };
        } catch (err) {
            throw new Error(`Error al actualizar sesion con ID ${id}: ${err.message}`);
        }
    }

    async deleteSesiones(id) {
        try {
            const result = await sql.query`DELETE FROM Sesiones WHERE ID_Sesion = ${id}`;
            return result.rowsAffected[0] > 0; // true si se eliminó, false si no se encontró
        } catch (err) {
            throw new Error(`Error al eliminar sesion con ID ${id}: ${err.message}`);
        }
    }
}

module.exports = new SesionesService();