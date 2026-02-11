const { sql } = require('../config/db');

class ZonasService {

  async getAllZonas() {
    try {
      const result = await sql.query(`
        SELECT ID_Zona, Nombre_Zona
        FROM Zonas
        ORDER BY Nombre_Zona
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener zonas: ${err.message}`);
    }
  }

  async getZonaById(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);

      const result = await request.query(`
        SELECT ID_Zona, Nombre_Zona
        FROM Zonas
        WHERE ID_Zona = @ID_Zona
      `);

      return result.recordset[0] || null;
    } catch (err) {
      throw new Error(`Error al obtener zona con ID ${id}: ${err.message}`);
    }
  }

  async createZona(zona) {
    try {
      const { Nombre_Zona } = zona;

      const request = new sql.Request();
      request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);

      const result = await request.query(`
        INSERT INTO Zonas (Nombre_Zona)
        VALUES (@Nombre_Zona);
        SELECT SCOPE_IDENTITY() AS ID_Zona;
      `);

      return {
        ID_Zona: result.recordset[0].ID_Zona,
        Nombre_Zona
      };
    } catch (err) {
      throw new Error(`Error al crear zona: ${err.message}`);
    }
  }

  async updateZona(id, zona) {
    try {
      const { Nombre_Zona } = zona;

      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);
      request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);

      const result = await request.query(`
        UPDATE Zonas
        SET Nombre_Zona = @Nombre_Zona
        WHERE ID_Zona = @ID_Zona
      `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return {
        ID_Zona: id,
        Nombre_Zona
      };
    } catch (err) {
      throw new Error(`Error al actualizar zona con ID ${id}: ${err.message}`);
    }
  }

  async deleteZona(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Zona', sql.Int, id);

      const result = await request.query(`
        DELETE FROM Zonas
        WHERE ID_Zona = @ID_Zona
      `);

      return result.rowsAffected[0] > 0;
    } catch (err) {
      throw new Error(`Error al eliminar zona con ID ${id}: ${err.message}`);
    }
  }
}

module.exports = new ZonasService();
