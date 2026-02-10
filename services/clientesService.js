// services/clientesService.js
const { sql } = require('../config/db');

class ClientesService {

    async getAllClientes() {
        try {
            const result = await sql.query('SELECT ID_Cliente, Nombre, Apellido, Telefono, Email, Notas FROM Clientes');
            return result.recordset;
        } catch (err) {
            throw new Error(`Error al obtener clientes: ${err.message}`);
        }
    }
    async buscarClientes(texto) {
  try {
    const request = new sql.Request();
    request.input("texto", sql.NVarChar, `%${texto}%`);

    const result = await request.query(`
      SELECT 
        ID_Cliente,
        Nombre,
        Apellido,
        Telefono,
        Email,
        Notas
      FROM Clientes
      WHERE 
        Nombre LIKE @texto
        OR Apellido LIKE @texto
        OR Telefono LIKE @texto
        OR Email LIKE @texto
      ORDER BY Apellido, Nombre
    `);

    return result.recordset;
  } catch (err) {
    throw new Error("Error al buscar clientes: " + err.message);
  }
}

    async getClientesConUltimaSesion() {
    try {
        const result = await sql.query(`
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
            GROUP BY
                c.ID_Cliente,
                c.Nombre,
                c.Apellido,
                c.Telefono,
                s.Fecha
            ORDER BY c.Apellido
        `);

        return result.recordset;
    } catch (err) {
        throw new Error(`Error al obtener clientes con última sesión: ${err.message}`);
    }
}


    async getClienteById(id) {
        try {
            const result = await sql.query`SELECT ID_Cliente, Nombre, Apellido, Telefono, Email, Notas FROM Clientes WHERE ID_Cliente = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw new Error(`Error al obtener cliente con ID ${id}: ${err.message}`);
        }
    }

    async createCliente(cliente) {
        try {
            const { Nombre, Apellido, Telefono, Email, Notas } = cliente;
            const request = new sql.Request();
            request.input('Nombre', sql.NVarChar, Nombre);
            request.input('Apellido', sql.NVarChar, Apellido);
            request.input('Telefono', sql.NVarChar, Telefono);
            request.input('Email', sql.NVarChar, Email);
            request.input('Notas', sql.NVarChar, Notas);

            const result = await request.query`
                INSERT INTO Clientes (Nombre, Apellido, Telefono, Email, Notas)
                VALUES (@Nombre, @Apellido, @Telefono, @Email, @Notas);
                SELECT SCOPE_IDENTITY() AS ID_Cliente;
            `;
            return { ID_Cliente: result.recordset[0].ID_Cliente, ...cliente };
        } catch (err) {
            throw new Error(`Error al crear cliente: ${err.message}`);
        }
    }

    async updateCliente(id, cliente) {
        try {
            const { Nombre, Apellido, Telefono, Email, Notas } = cliente;
            const request = new sql.Request();
            request.input('ID_Cliente', sql.Int, id);
            request.input('Nombre', sql.NVarChar, Nombre);
            request.input('Apellido', sql.NVarChar, Apellido);
            request.input('Telefono', sql.NVarChar, Telefono);
            request.input('Email', sql.NVarChar, Email);
            request.input('Notas', sql.NVarChar, Notas);

            const result = await request.query`
                UPDATE Clientes
                SET Nombre = @Nombre, Apellido = @Apellido, Telefono = @Telefono, Email = @Email, Notas = @Notas
                WHERE ID_Cliente = @ID_Cliente;
            `;
            if (result.rowsAffected[0] === 0) {
                return null; // Cliente no encontrado
            }
            return { ID_Cliente: id, ...cliente };
        } catch (err) {
            throw new Error(`Error al actualizar cliente con ID ${id}: ${err.message}`);
        }
    }

    /*async deleteCliente(id) {
        try {
            const result = await sql.query`DELETE FROM Clientes WHERE ID_Cliente = ${id}`;
            return result.rowsAffected[0] > 0; // true si se eliminó, false si no se encontró
        } catch (err) {
            throw new Error(`Error al eliminar cliente con ID ${id}: ${err.message}`);
        }
    }*/
   async deleteCliente(id) {
    const request = new sql.Request();
    request.input('ID_Cliente', sql.Int, id);

    const result = await request.query(`
        DELETE FROM Clientes WHERE ID_Cliente = @ID_Cliente
    `);

    return result.rowsAffected[0] > 0;
}

}

module.exports = new ClientesService();