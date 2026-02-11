// services/detallesSesionesService.js
const { sql } = require('../config/db');

class DetallesSesionesService {

  async getAllDetallesSesiones() {
    try {
      const result = await sql.query(`
        SELECT 
          d.ID_DetalleSesion,
          d.ID_Sesion,
          d.ID_Zona,
          z.Nombre_Zona,
          d.Potencia,
          d.Notas
        FROM DetallesSesiones d
        INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener detalles de sesiones: ${err.message}`);
    }
  }

  async getDetalleSesionById(id) {
    try {
      const request = new sql.Request();
      request.input('ID_DetalleSesion', sql.Int, id);

      const result = await request.query(`
        SELECT 
          d.ID_DetalleSesion,
          d.ID_Sesion,
          d.ID_Zona,
          z.Nombre_Zona,
          d.Potencia,
          d.Notas
        FROM DetallesSesiones d
        INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
        WHERE d.ID_DetalleSesion = @ID_DetalleSesion
      `);

      return result.recordset[0] || null;
    } catch (err) {
      throw new Error(`Error al obtener detalle de sesión con ID ${id}: ${err.message}`);
    }
  }

  // 🔥 NUEVO: detalles por sesión (clave para Android)
  async getDetallesBySesion(idSesion) {
    try {
      const request = new sql.Request();
      request.input('ID_Sesion', sql.Int, idSesion);

      const result = await request.query(`
        SELECT 
          d.ID_DetalleSesion,
          d.ID_Zona,
          z.Nombre_Zona,
          d.Potencia,
          d.Notas
        FROM DetallesSesiones d
        INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
        WHERE d.ID_Sesion = @ID_Sesion
        ORDER BY z.Nombre_Zona
      `);

      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener detalles de la sesión ${idSesion}`);
    }
  }

  async createDetalleSesion(detalle) {
    try {
      const { ID_Sesion, ID_Zona, Potencia, Notas } = detalle;
      const request = new sql.Request();

      request.input('ID_Sesion', sql.Int, ID_Sesion);
      request.input('ID_Zona', sql.Int, ID_Zona);
      request.input('Potencia', sql.VarChar, Potencia);
      request.input('Notas', sql.VarChar, Notas || null);

      const result = await request.query(`
        INSERT INTO DetallesSesiones (ID_Sesion, ID_Zona, Potencia, Notas)
        VALUES (@ID_Sesion, @ID_Zona, @Potencia, @Notas);
        SELECT SCOPE_IDENTITY() AS ID_DetalleSesion;
      `);

      return {
        ID_DetalleSesion: result.recordset[0].ID_DetalleSesion,
        ...detalle
      };
    } catch (err) {
      throw new Error(`Error al crear detalle de sesión: ${err.message}`);
    }
  }

  async updateDetalleSesion(id, detalle) {
    try {
      const { ID_Sesion, ID_Zona, Potencia, Notas } = detalle;
      const request = new sql.Request();

      request.input('ID_DetalleSesion', sql.Int, id);
      request.input('ID_Sesion', sql.Int, ID_Sesion);
      request.input('ID_Zona', sql.Int, ID_Zona);
      request.input('Potencia', sql.VarChar, Potencia);
      request.input('Notas', sql.VarChar, Notas || null);

      const result = await request.query(`
        UPDATE DetallesSesiones
        SET 
          ID_Sesion = @ID_Sesion,
          ID_Zona = @ID_Zona,
          Potencia = @Potencia,
          Notas = @Notas
        WHERE ID_DetalleSesion = @ID_DetalleSesion
      `);

      if (result.rowsAffected[0] === 0) return null;

      return { ID_DetalleSesion: id, ...detalle };
    } catch (err) {
      throw new Error(`Error al actualizar detalle de sesión con ID ${id}`);
    }
  }

  async deleteDetalleSesion(id) {
    try {
      const request = new sql.Request();
      request.input('ID_DetalleSesion', sql.Int, id);

      const result = await request.query(`
        DELETE FROM DetallesSesiones 
        WHERE ID_DetalleSesion = @ID_DetalleSesion
      `);

      return result.rowsAffected[0] > 0;
    } catch (err) {
      throw new Error(`Error al eliminar detalle de sesión con ID ${id}`);
    }
  }
}

module.exports = new DetallesSesionesService();
