const { sql } = require('../config/db');

class DetallesSesionesService {
    async getAllDetallesSesiones() {
        try {
            const result = await sql.query(`
                SELECT d.*, z.Nombre_Zona
                FROM DetallesSesiones d
                INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
            `);
            return result.recordset;
        } catch (err) {
            throw new Error(`Error al obtener detalles de sesiones : ${err.message}`);
        }
    }

    async getDetallesSesionesById(id) {
        try {
            const result = await sql.query`
                SELECT d.*, z.Nombre_Zona
                FROM DetallesSesiones d
                INNER JOIN Zonas z ON d.ID_Zona = z.ID_Zona
                WHERE d.ID_DetalleSesion = ${id}
            `;
            return result.recordset[0];
        } catch (err) {
            throw new Error(`Error al obtener detalle de sesion con ID ${id}: ${err.message}`);
        }
    }

    async createDetallesSesiones(DetSesion) {
        try {
            const { ID_Sesion, ID_Zona, Potencia, Notas } = DetSesion;
            const request = new sql.Request();
            request.input('ID_Sesion', sql.Int, ID_Sesion);
            request.input('ID_Zona', sql.Int, ID_Zona);
            request.input('Potencia', sql.VarChar, Potencia);
            request.input('Notas', sql.VarChar, Notas);

            const result = await request.query`
                INSERT INTO DetallesSesiones (ID_Sesion, ID_Zona, Potencia, Notas)
                VALUES (@ID_Sesion, @ID_Zona, @Potencia, @Notas);
                SELECT SCOPE_IDENTITY() AS ID_DetalleSesion;
            `;
            return { ID_DetalleSesion: result.recordset[0].ID_DetalleSesion, ...DetSesion };
        } catch (err) {
            throw new Error(`Error al crear detalle de sesion: ${err.message}`);
        }
    }

    async updateDetallesSesiones(id, DetSesion) {
        try {
            const { ID_Sesion, ID_Zona, Potencia, Notas} = DetSesion;
            const request = new sql.Request();
            request.input('ID_DetalleSesion', sql.Int, id);
            request.input('ID_Sesion', sql.Int, ID_Sesion);
            request.input('ID_Zona', sql.Int, ID_Zona);
            request.input('Potencia', sql.VarChar, Potencia);
            request.input('Notas', sql.VarChar, Notas);

            const result = await request.query`
                UPDATE DetallesSesiones
                SET ID_Sesion = @ID_Sesion, ID_Zona = @ID_Zona, Potencia = @Potencia, Notas = @Notas
                WHERE ID_DetalleSesion = @ID_DetalleSesion;
                `;
            if (result.rowsAffected[0] === 0) {
                return null; // Cliente no encontrado
            }
            return { ID_DetalleSesion: id, ...DetSesion };
        } catch (err) {
            throw new Error(`Error al actualizar detalle de sesion con ID ${id}: ${err.message}`);
        }
    }

    async deleteDetallesSesiones(id) {
        try {
            const result = await sql.query`DELETE FROM DetallesSesiones WHERE ID_DetalleSesion = ${id}`;
            return result.rowsAffected[0] > 0; // true si se eliminó, false si no se encontró
        } catch (err) {
            throw new Error(`Error al eliminar detalle de sesion con ID ${id}: ${err.message}`);
        }
    }
}

module.exports = new DetallesSesionesService();
