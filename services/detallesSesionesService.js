const { sql } = require('../config/db');

class DetallesSesionesService {

  async getAllDetallesSesiones(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        d.ID_DetalleSesion,
        d.ID_Sesion,
        d.ID_Zona,
        z.Nombre_Zona,
        d.Potencia,
        d.Notas
      FROM DetallesSesiones d
      INNER JOIN Sesiones s ON d.ID_Sesion = s.ID_Sesion
      INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
      WHERE s.ID_Centro = @ID_Centro
    `);

    return result.recordset;
  }

  async getDetalleSesionById(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_DetalleSesion', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        d.ID_DetalleSesion,
        d.ID_Sesion,
        d.ID_Zona,
        z.Nombre_Zona,
        d.Potencia,
        d.Notas
      FROM DetallesSesiones d
      INNER JOIN Sesiones s ON d.ID_Sesion = s.ID_Sesion
      INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
      WHERE d.ID_DetalleSesion = @ID_DetalleSesion
        AND s.ID_Centro = @ID_Centro
    `);

    return result.recordset[0] || null;
  }

  async getDetallesBySesion(idSesion, idCentro) {
    const request = new sql.Request();
    request.input('ID_Sesion', sql.Int, idSesion);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        d.ID_DetalleSesion,
        d.ID_Zona,
        z.Nombre_Zona,
        d.Potencia,
        d.Notas
      FROM DetallesSesiones d
      INNER JOIN Sesiones s ON d.ID_Sesion = s.ID_Sesion
      INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
      WHERE d.ID_Sesion = @ID_Sesion
        AND s.ID_Centro = @ID_Centro
      ORDER BY z.Nombre_Zona
    `);

    return result.recordset;
  }

  async createDetalleSesion(detalle, idCentro) {
    const { ID_Sesion, ID_Zona, Potencia, Notas } = detalle;

    const request = new sql.Request();
    request.input('ID_Sesion', sql.Int, ID_Sesion);
    request.input('ID_Centro', sql.Int, idCentro);

    // 🔒 Validar que la sesión pertenezca al centro
    const validacion = await request.query(`
      SELECT ID_Sesion
      FROM Sesiones
      WHERE ID_Sesion = @ID_Sesion
        AND ID_Centro = @ID_Centro
    `);

    if (validacion.recordset.length === 0) {
      return null;
    }

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
  }

  async updateDetalleSesion(id, detalle, idCentro) {
    const { ID_Zona, Potencia, Notas } = detalle;

    const request = new sql.Request();
    request.input('ID_DetalleSesion', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      UPDATE d
      SET 
        d.ID_Zona = @ID_Zona,
        d.Potencia = @Potencia,
        d.Notas = @Notas
      FROM DetallesSesiones d
      INNER JOIN Sesiones s ON d.ID_Sesion = s.ID_Sesion
      WHERE d.ID_DetalleSesion = @ID_DetalleSesion
        AND s.ID_Centro = @ID_Centro
    `);

    if (result.rowsAffected[0] === 0) return null;

    return { ID_DetalleSesion: id, ...detalle };
  }

  async deleteDetalleSesion(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_DetalleSesion', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      DELETE d
      FROM DetallesSesiones d
      INNER JOIN Sesiones s ON d.ID_Sesion = s.ID_Sesion
      WHERE d.ID_DetalleSesion = @ID_DetalleSesion
        AND s.ID_Centro = @ID_Centro
    `);

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new DetallesSesionesService();