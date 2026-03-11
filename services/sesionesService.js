const { sql } = require('../config/db');
const { formatDate } = require('../src/utils/dateFormatter');

class SesionesService {

async getAllSesiones(idCentro) {
  const request = new sql.Request();
  request.input('ID_Centro', sql.Int, idCentro);

  const result = await request.query(`
    SELECT 
      s.ID_Sesion,
      s.Fecha,
      c.ID_Cliente,
      c.Nombre AS Nombre_Cliente,
      c.Apellido AS Apellido_Cliente,
      z.Nombre_Zona,
      ds.Potencia,
      ds.Notas
    FROM Sesiones s
    INNER JOIN Clientes c ON s.ID_Cliente = c.ID_Cliente
    LEFT JOIN DetallesSesiones ds ON s.ID_Sesion = ds.ID_Sesion
    LEFT JOIN Zonas z ON ds.ID_Zona = z.ID_Zona
    WHERE s.ID_Centro = @ID_Centro
    ORDER BY s.ID_Sesion DESC
  `);

  const sesionesMap = new Map();

  for (const row of result.recordset) {

    if (!sesionesMap.has(row.ID_Sesion)) {
      sesionesMap.set(row.ID_Sesion, {
        ID_Sesion: row.ID_Sesion,
        Fecha: formatDate(row.Fecha),
        Cliente: {
          ID_Cliente: row.ID_Cliente,
          Nombre: row.Nombre_Cliente
        },
        Zonas: []
      });
    }

    if (row.Nombre_Zona) {
      sesionesMap.get(row.ID_Sesion).Zonas.push({
        Nombre_Zona: row.Nombre_Zona,
        Potencia: row.Potencia,
        Notas: row.Notas
      });
    }
  }

  return Array.from(sesionesMap.values());
}

 async getSesionesById(id, idCentro) {
  const request = new sql.Request();
  request.input('ID_Sesion', sql.Int, id);
  request.input('ID_Centro', sql.Int, idCentro);

  const result = await request.query(`
    SELECT 
      s.ID_Sesion,
      s.Fecha,
      c.ID_Cliente,
      c.Nombre AS Nombre_Cliente,
      z.Nombre_Zona,
      ds.Potencia,
      ds.Notas
    FROM Sesiones s
    INNER JOIN Clientes c ON s.ID_Cliente = c.ID_Cliente
    LEFT JOIN DetallesSesiones ds ON s.ID_Sesion = ds.ID_Sesion
    LEFT JOIN Zonas z ON ds.ID_Zona = z.ID_Zona
    WHERE s.ID_Sesion = @ID_Sesion
      AND s.ID_Centro = @ID_Centro
  `);

  return result.recordset;
}
  /*async createSesion(data, idCentro) {
    const { ID_Cliente, Fecha } = data;

    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, ID_Cliente);
    request.input('ID_Centro', sql.Int, idCentro);

    // 🔒 Validar cliente pertenece al centro
    const validacion = await request.query(`
      SELECT ID_Cliente
      FROM Clientes
      WHERE ID_Cliente = @ID_Cliente
        AND ID_Centro = @ID_Centro
    `);

    if (validacion.recordset.length === 0) {
      return null;
    }

    
    request.input('Fecha', sql.Date, Fecha);

    const result = await request.query(`
      INSERT INTO Sesiones (ID_Cliente, Fecha, ID_Centro)
      VALUES (@ID_Cliente, @Fecha, @ID_Centro);
      SELECT SCOPE_IDENTITY() AS ID_Sesion;
    `);

    return { ID_Sesion: result.recordset[0].ID_Sesion, ...data };
  }
*/
  async createSesionCompleta(data, idCentro) {
    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    const { ID_Cliente, Fecha, Detalles } = data;

    await transaction.begin();

    try {
      const sesionRequest = new sql.Request(transaction);
      sesionRequest.input('ID_Cliente', sql.Int, ID_Cliente);
      sesionRequest.input('ID_Centro', sql.Int, idCentro);
      sesionRequest.input('Fecha', sql.Date, Fecha);

      const validacion = await sesionRequest.query(`
        SELECT ID_Cliente
        FROM Clientes
        WHERE ID_Cliente = @ID_Cliente
          AND ID_Centro = @ID_Centro
      `);

      if (validacion.recordset.length === 0) {
        throw new Error('Cliente no pertenece al centro');
      }
        
      const sesionResult = await sesionRequest.query(`
        INSERT INTO Sesiones (ID_Cliente, Fecha, ID_Centro)
        VALUES (@ID_Cliente, @Fecha, @ID_Centro);
        SELECT SCOPE_IDENTITY() AS ID_Sesion;
      `);

      const ID_Sesion = parseInt(sesionResult.recordset[0].ID_Sesion);
          console.log("DATA RECIBIDA:", data);
          console.log("Detalles:", Detalles);
          console.log("Es array?", Array.isArray(Detalles));
          
      for (const detalle of Detalles) {

        console.log("DETALLE QUE SE VA A INSERTAR:", detalle);
        console.log("QUERY DETALLES ejecutándose...");

        const detalleRequest = new sql.Request(transaction);
        detalleRequest.input('ID_Sesion', sql.Int, ID_Sesion);
        detalleRequest.input('ID_Zona', sql.Int, detalle.ID_Zona);
        detalleRequest.input('Potencia', sql.VarChar, detalle.Potencia || null);
        detalleRequest.input('Notas', sql.VarChar, detalle.Notas || null);

        
        await detalleRequest.query(`
          INSERT INTO DetallesSesiones (ID_Sesion, ID_Zona, Potencia, Notas)
          VALUES (@ID_Sesion, @ID_Zona, @Potencia, @Notas);
        `);
      }

      await transaction.commit();

      return { ID_Sesion, ID_Cliente, Fecha, Detalles };

    } catch (err) {
      console.error("ERROR SQL:", err);
      await transaction.rollback();
      throw err;
    }
  }

  async updateSesiones(id, data, idCentro) {
    const { ID_Cliente, Notas, Fecha } = data;

    const request = new sql.Request();
    request.input('ID_Sesion', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('ID_Cliente', sql.Int, ID_Cliente);
    request.input('Notas', sql.VarChar, Notas || null);
    request.input('Fecha', sql.Date, Fecha);

    const result = await request.query(`
      UPDATE Sesiones
      SET ID_Cliente = @ID_Cliente,
          Notas = @Notas,
          Fecha = @Fecha
      WHERE ID_Sesion = @ID_Sesion
        AND ID_Centro = @ID_Centro
    `);

    if (result.rowsAffected[0] === 0) return null;

    return { ID_Sesion: id, ...data };
  }

  async deleteSesiones(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Sesion', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      DELETE FROM Sesiones
      WHERE ID_Sesion = @ID_Sesion
        AND ID_Centro = @ID_Centro
    `);

    return result.rowsAffected[0] > 0;
  }

 async getDetalleSesion(idSesion, idCentro) {
  const request = new sql.Request();
  request.input('ID_Sesion', sql.Int, idSesion);
  request.input('ID_Centro', sql.Int, idCentro);

  const result = await request.query(`
    SELECT 
      s.ID_Sesion,
      s.Fecha,
      z.Nombre_Zona,
      ds.Potencia,
      ds.Notas
    FROM Sesiones s
    INNER JOIN DetallesSesiones ds ON s.ID_Sesion = ds.ID_Sesion
    INNER JOIN Zonas z ON ds.ID_Zona = z.ID_Zona
    WHERE s.ID_Sesion = @ID_Sesion
      AND s.ID_Centro = @ID_Centro
  `);

  if (result.recordset.length === 0) return null;

  return {
    ID_Sesion: result.recordset[0].ID_Sesion,
    Fecha: formatDate(result.recordset[0].Fecha),
    Zonas: result.recordset.map(row => ({
      Nombre_Zona: row.Nombre_Zona,
      Potencia: row.Potencia,
      Notas: row.Notas
    }))
  };
}
}

module.exports = new SesionesService();