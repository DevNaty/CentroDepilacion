// services/clienteService.js
const { sql } = require('../config/db');

class TurnosService {
    async getAllTurnos() {
        try {
            const result = await sql.query
            ('SELECT *  FROM Turnos');
            return result.recordset;
        } catch (err) {
            throw new Error(`Error al obtener turnos : ${err.message}`);
        }
    }

    async getTurnoById(id) {
        try {
            const result = await sql.query`SELECT * FROM Turnos WHERE ID_Turno = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw new Error(`Error al obtener turno con ID ${id}: ${err.message}`);
        }
    }

    async createTurno(Turno) {
        try {
            const { ID_Cliente, Fecha, Hora } = Turno;
            const horaValue = Hora ? new Date(`1970-01-01T${Hora}`) : null;
            const request = new sql.Request();
            request.input('ID_Cliente', sql.Int, ID_Cliente);
            request.input('Fecha', sql.Date, Fecha);
            request.input('Hora', sql.Time, horaValue);
            

            const result = await request.query`
                INSERT INTO Turnos (ID_Cliente, Fecha, Hora)
                VALUES (@ID_Cliente,  @Fecha, @Hora);
                SELECT SCOPE_IDENTITY() AS ID_Turno;
            `;
            return { ID_Turno: result.recordset[0].ID_Turno, ...Turno };
        } catch (err) {
            throw new Error(`Error al crear turno: ${err.message}`);
        }
    }

    async updateTurno(id, Turno) {
        try {
            const { ID_Cliente, Fecha, Hora } = Turno;
            const horaValue = Hora ? new Date(`1970-01-01T${Hora}`) : null;
            const request = new sql.Request();
            request.input('ID_Turno', sql.Int, id);
            request.input('ID_Cliente', sql.Int, ID_Cliente);
            request.input('Fecha', sql.Date, Fecha);
            request.input('Hora', sql.Time, horaValue);

            const result = await request.query`
                UPDATE Turnos
                SET ID_Cliente = @ID_Cliente, Fecha = @Fecha, Hora = @Hora
                WHERE ID_Turno = @ID_Turno;
                `;
            if (result.rowsAffected[0] === 0) {
                return null; // Turno no encontrado
            }
            return { ID_Turno: id, ...Turno };
        } catch (err) {
            throw new Error(`Error al actualizar turno con ID ${id}: ${err.message}`);
        }
    }

    async deleteTurno(id) {
        try {
            const result = await sql.query`DELETE FROM Turnos WHERE ID_Turno = ${id}`;
            return result.rowsAffected[0] > 0; // true si se eliminó, false si no se encontró
        } catch (err) {
            throw new Error(`Error al eliminar turno con ID ${id}: ${err.message}`);
        }
    }
}

module.exports = new TurnosService();
