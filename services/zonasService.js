const { sql } = require('../config/db');

class ZonasService {

  async getAllZonas(idCentro) {
    try {
      const request = new sql.Request();
      request.input('ID_Centro', sql.Int, idCentro);

      const result = await request.query(`
        SELECT ID_Zona, Nombre_Zona, Tiempo, TiempoMinutos, Precio
        FROM Zonas
        WHERE ID_Centro = @ID_Centro
        ORDER BY Nombre_Zona
      `);

      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener zonas: ${err.message}`);
    }
  }

  async getZonaById(id, idCentro) {
    try {
      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);
      request.input('ID_Centro', sql.Int, idCentro);

      const result = await request.query(`
        SELECT ID_Zona, Nombre_Zona, Tiempo, TiempoMinutos, Precio
        FROM Zonas
        WHERE ID_Zona = @ID_Zona
        AND ID_Centro = @ID_Centro
      `);

      return result.recordset[0] || null;
    } catch (err) {
      throw new Error(`Error al obtener zona con ID ${id}: ${err.message}`);
    }
  }
async createZona(zona, idCentro) {
  try {
    const { Nombre_Zona, TiempoMinutos, Precio } = zona;

    // 👇 convertir minutos a formato HH:MM:SS
    const horas = Math.floor(TiempoMinutos / 60);
    const minutos = TiempoMinutos % 60;
    const tiempoFormateado = `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}:00`;

    const request = new sql.Request();
    request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('Tiempo', sql.Time, tiempoFormateado);
    request.input('TiempoMinutos', sql.Int, TiempoMinutos);
    request.input('Precio', sql.Decimal(10, 2), Precio);

    const result = await request.query(`
      INSERT INTO Zonas (Nombre_Zona, ID_Centro, Tiempo, TiempoMinutos, Precio)
      VALUES (@Nombre_Zona, @ID_Centro, @Tiempo, @TiempoMinutos, @Precio);

      SELECT SCOPE_IDENTITY() AS ID_Zona;
    `);

    return {
      ID_Zona: result.recordset[0].ID_Zona,
      Nombre_Zona,
      Tiempo: tiempoFormateado,
      TiempoMinutos,
      Precio
    };

  } catch (err) {
    throw new Error(`Error al crear zona: ${err.message}`);
  }
}
 /* async createZona(zona, idCentro) {
    try {
      const { Nombre_Zona, Tiempo, TiempoMinutos, Precio } = zona;

      const request = new sql.Request();
      request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);
      request.input('ID_Centro', sql.Int, idCentro);
      request.input('Tiempo', sql.Time, Tiempo);
      request.input('TiempoMinutos', sql.Int, TiempoMinutos);
      request.input('Precio', sql.Decimal(10, 2), Precio);

      const result = await request.query(`
        INSERT INTO Zonas (Nombre_Zona, ID_Centro, Tiempo, TiempoMinutos, Precio)
        VALUES (@Nombre_Zona, @ID_Centro, @Tiempo, @TiempoMinutos, @Precio);

        SELECT SCOPE_IDENTITY() AS ID_Zona;
      `);

      return {
        ID_Zona: result.recordset[0].ID_Zona,
        Nombre_Zona,
        Tiempo,
        TiempoMinutos,
        Precio
      };

    } catch (err) {
      throw new Error(`Error al crear zona: ${err.message}`);
    }
  }*/

  async updateZona(id, zona, idCentro) {
    try {
      const { Nombre_Zona, Tiempo, TiempoMinutos, Precio } = zona;

      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);
      request.input('ID_Centro', sql.Int, idCentro);
      request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);
      request.input('Tiempo', sql.Time, Tiempo);
      request.input('TiempoMinutos', sql.Int, TiempoMinutos);
      request.input('Precio', sql.Decimal(10, 2), Precio);

      const result = await request.query(`
        UPDATE Zonas
        SET Nombre_Zona = @Nombre_Zona,
            Tiempo = @Tiempo,
            TiempoMinutos = @TiempoMinutos,
            Precio = @Precio
        WHERE ID_Zona = @ID_Zona
        AND ID_Centro = @ID_Centro
      `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return {
        ID_Zona: id,
        Nombre_Zona,
        Tiempo,
        TiempoMinutos,
        Precio
      };

    } catch (err) {
      throw new Error(`Error al actualizar zona con ID ${id}: ${err.message}`);
    }
  }

  async deleteZona(id, idCentro) {
    try {
      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);
      request.input('ID_Centro', sql.Int, idCentro);

      const result = await request.query(`
        DELETE FROM Zonas
        WHERE ID_Zona = @ID_Zona
        AND ID_Centro = @ID_Centro
      `);

      return result.rowsAffected[0] > 0;

    } catch (err) {
      throw new Error(`Error al eliminar zona con ID ${id}: ${err.message}`);
    }
  }
}

module.exports = new ZonasService();