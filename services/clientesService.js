const { sql } = require('../config/db');

class ClientesService {

  async getAllClientes(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        ID_Cliente,
        Nombre,
        Apellido,
        Telefono,
        Email,
        Notas,
        Genero
      FROM Clientes
      WHERE ID_Centro = @ID_Centro
    `);

    return result.recordset;
  }

  async buscarClientes(texto, idCentro) {
    const request = new sql.Request();
    request.input('texto', sql.NVarChar, `%${texto}%`);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        ID_Cliente,
        Nombre,
        Apellido,
        Telefono,
        Email,
        Notas,
        Genero
      FROM Clientes
      WHERE ID_Centro = @ID_Centro
        AND (
          Nombre LIKE @texto
          OR Apellido LIKE @texto
          OR Telefono LIKE @texto
          OR Email LIKE @texto
        )
      ORDER BY Apellido, Nombre
    `);

    return result.recordset;
  }

  async getClientesConUltimaSesion(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT
        c.ID_Cliente,
        c.Nombre,
        c.Apellido,
        c.Telefono,
        s.Fecha AS UltimaSesion,
        STRING_AGG(z.Nombre_Zona, ' · ') AS Zonas
      FROM Clientes c
      LEFT JOIN Sesiones s
        ON s.ID_Sesion = (
          SELECT TOP 1 ID_Sesion
          FROM Sesiones
          WHERE ID_Cliente = c.ID_Cliente
          ORDER BY Fecha DESC
        )
      LEFT JOIN DetallesSesiones ds
        ON ds.ID_Sesion = s.ID_Sesion
      LEFT JOIN Zonas z
        ON z.ID_Zona = ds.ID_Zona
      WHERE c.ID_Centro = @ID_Centro
      GROUP BY
        c.ID_Cliente,
        c.Nombre,
        c.Apellido,
        c.Telefono,
        s.Fecha
      ORDER BY c.Apellido
    `);

    return result.recordset;
  }

  async getClienteById(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        ID_Cliente,
        Nombre,
        Apellido,
        Telefono,
        Email,
        Notas,
        Genero
      FROM Clientes
      WHERE ID_Cliente = @ID_Cliente
        AND ID_Centro = @ID_Centro
    `);

    return result.recordset[0] || null;
  }

  async createCliente(cliente) {
    const { Nombre, Apellido, Telefono, Email, Notas, idCentro, Genero } = cliente;

    const request = new sql.Request();
    request.input('Nombre', sql.NVarChar, Nombre);
    request.input('Apellido', sql.NVarChar, Apellido);
    request.input('Telefono', sql.NVarChar, Telefono);
    request.input('Email', sql.NVarChar, Email);
    request.input('Notas', sql.NVarChar, Notas);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('Genero', sql.NVarChar, Genero);

    const result = await request.query(`
      INSERT INTO Clientes (Nombre, Apellido, Telefono, Email, Notas, ID_Centro, Genero)
      VALUES (@Nombre, @Apellido, @Telefono, @Email, @Notas, @ID_Centro, @Genero);
      SELECT SCOPE_IDENTITY() AS ID_Cliente;
    `);

    return { ID_Cliente: result.recordset[0].ID_Cliente, ...cliente };
  }

  async updateCliente(id, cliente, idCentro) {
    const { Nombre, Apellido, Telefono, Email, Notas, Genero } = cliente;

    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('Nombre', sql.NVarChar, Nombre);
    request.input('Apellido', sql.NVarChar, Apellido);
    request.input('Telefono', sql.NVarChar, Telefono);
    request.input('Email', sql.NVarChar, Email);
    request.input('Notas', sql.NVarChar, Notas);
    request.input('Genero', sql.NVarChar, Genero);

    const result = await request.query(`
      UPDATE Clientes
      SET 
        Nombre = @Nombre,
        Apellido = @Apellido,
        Telefono = @Telefono,
        Email = @Email,
        Notas = @Notas,
        Genero = @Genero
      WHERE ID_Cliente = @ID_Cliente
        AND ID_Centro = @ID_Centro
    `);

    if (result.rowsAffected[0] === 0) return null;

    return { ID_Cliente: id, ...cliente };
  }

  async deleteCliente(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      DELETE FROM Clientes
      WHERE ID_Cliente = @ID_Cliente
        AND ID_Centro = @ID_Centro
    `);

    return result.rowsAffected[0] > 0;
  }

  async getHistorialSesiones(idCliente, idCentro) {
    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, idCliente);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        s.ID_Sesion,
        s.Fecha,
        COUNT(ds.ID_DetalleSesion) AS CantidadZonas
      FROM Sesiones s
      LEFT JOIN DetallesSesiones ds 
        ON s.ID_Sesion = ds.ID_Sesion
      WHERE s.ID_Cliente = @ID_Cliente
        AND s.ID_Centro = @ID_Centro
      GROUP BY s.ID_Sesion, s.Fecha
      ORDER BY s.Fecha DESC
    `);

    return result.recordset;
  }

}

module.exports = new ClientesService();