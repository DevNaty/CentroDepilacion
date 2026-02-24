const { sql } = require('../config/db');

class ZonasService {

  
async getAllZonas(idCentro) {
  try {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT ID_Zona, Nombre_Zona
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
      SELECT ID_Zona, Nombre_Zona
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
    const { Nombre_Zona } = zona;

    const request = new sql.Request();
    request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      INSERT INTO Zonas (Nombre_Zona, ID_Centro)
      VALUES (@Nombre_Zona, @ID_Centro);

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

async updateZona(id, zona, idCentro) {
  try {
    const { Nombre_Zona } = zona;

    const request = new sql.Request();
    request.input('ID_Zona', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('Nombre_Zona', sql.NVarChar, Nombre_Zona);

    const result = await request.query(`
      UPDATE Zonas
      SET Nombre_Zona = @Nombre_Zona
      WHERE ID_Zona = @ID_Zona
      AND ID_Centro = @ID_Centro
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
