const { sql } = require('../config/db');

class SesionesService {

  async getAllSesiones() {
    try {
      const result = await sql.query('SELECT * FROM Sesiones');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener sesiones: ${err.message}`);
    }
  }

  async getSesionesById(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Sesion', sql.Int, id);

      const result = await request.query(`
        SELECT * FROM Sesiones WHERE ID_Sesion = @ID_Sesion
      `);

      return result.recordset[0];
    } catch (err) {
      throw new Error(`Error al obtener sesión con ID ${id}: ${err.message}`);
    }
  }

  async createSesion(sesion) {
    try {
      const { ID_Cliente, Notas, Fecha } = sesion;

      const request = new sql.Request();
      request.input('ID_Cliente', sql.Int, ID_Cliente);
      request.input('Notas', sql.VarChar, Notas || null);
      request.input('Fecha', sql.Date, Fecha);

      const result = await request.query(`
        INSERT INTO Sesiones (ID_Cliente, Notas, Fecha)
        VALUES (@ID_Cliente, @Notas, @Fecha);
        SELECT SCOPE_IDENTITY() AS ID_Sesion;
      `);

      return { ID_Sesion: result.recordset[0].ID_Sesion, ...sesion };
    } catch (err) {
      throw new Error(`Error al crear sesión: ${err.message}`);
    }
  }

  async createSesionCompleta(data) {
    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    const { ID_Cliente, Fecha, Detalles } = data;

    if (!Array.isArray(Detalles) || Detalles.length === 0) {
      throw new Error('La sesión debe tener al menos una zona');
    }

    try {
      await transaction.begin();

      // Crear sesión
      const sesionRequest = new sql.Request(transaction);
      sesionRequest.input('ID_Cliente', sql.Int, ID_Cliente);
      sesionRequest.input('Fecha', sql.Date, Fecha);

      const sesionResult = await sesionRequest.query(`
        INSERT INTO Sesiones (ID_Cliente, Fecha)
        VALUES (@ID_Cliente, @Fecha);
        SELECT SCOPE_IDENTITY() AS ID_Sesion;
      `);

      const ID_Sesion = sesionResult.recordset[0].ID_Sesion;

      // Crear detalles
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

      return { ID_Sesion, ID_Cliente, Fecha, Detalles };

    } catch (err) {
      await transaction.rollback();
      throw new Error(`Error al crear sesión completa: ${err.message}`);
    }
  }

  async updateSesiones(id, sesion) {
    try {
      const { ID_Cliente, Notas, Fecha } = sesion;

      const request = new sql.Request();
      request.input('ID_Sesion', sql.Int, id);
      request.input('ID_Cliente', sql.Int, ID_Cliente);
      request.input('Notas', sql.VarChar, Notas || null);
      request.input('Fecha', sql.Date, Fecha);

      const result = await request.query(`
        UPDATE Sesiones
        SET ID_Cliente = @ID_Cliente,
            Notas = @Notas,
            Fecha = @Fecha
        WHERE ID_Sesion = @ID_Sesion;
      `);

      if (result.rowsAffected[0] === 0) return null;

      return { ID_Sesion: id, ...sesion };
    } catch (err) {
      throw new Error(`Error al actualizar sesión con ID ${id}: ${err.message}`);
    }
  }

  async deleteSesiones(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Sesion', sql.Int, id);

      const result = await request.query(`
        DELETE FROM Sesiones WHERE ID_Sesion = @ID_Sesion
      `);

      return result.rowsAffected[0] > 0;
    } catch (err) {
      throw new Error(`Error al eliminar sesión con ID ${id}: ${err.message}`);
    }
  }

  async getDetalleSesion(idSesion) {
    try {
      const request = new sql.Request();
      request.input('ID_Sesion', sql.Int, idSesion);

      const result = await request.query(`
        SELECT 
          s.ID_Sesion,
          s.Fecha,
          z.ID_Zona,
          z.Nombre_Zona,
          ds.Potencia,
          ds.Notas
        FROM Sesiones s
        INNER JOIN DetallesSesiones ds ON s.ID_Sesion = ds.ID_Sesion
        INNER JOIN Zonas z ON ds.ID_Zona = z.ID_Zona
        WHERE s.ID_Sesion = @ID_Sesion
      `);

      if (result.recordset.length === 0) return null;

      return {
        ID_Sesion: result.recordset[0].ID_Sesion,
        Fecha: result.recordset[0].Fecha,
        Zonas: result.recordset.map(row => ({
          ID_Zona: row.ID_Zona,
          Nombre_Zona: row.Nombre_Zona,
          Potencia: row.Potencia,
          Notas: row.Notas
        }))
      };
    } catch (err) {
      throw new Error(`Error al obtener detalle de sesión: ${err.message}`);
    }
  }
}

module.exports = new SesionesService();
