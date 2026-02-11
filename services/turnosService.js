const { sql } = require('../config/db');

class TurnosService {

  async getAllTurnos() {
    try {
      const result = await sql.query('SELECT * FROM Turnos');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener turnos: ${err.message}`);
    }
  }

  async getTurnosVista() {
    try {
      const result = await sql.query(`
        SELECT 
          t.ID_Turno,
          t.Fecha,
          t.Hora,
          c.Nombre AS Nombre_Cliente,
          c.Apellido AS Apellido_Cliente
        FROM Turnos t
        LEFT JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
        ORDER BY c.Nombre, c.Apellido, t.Fecha, t.Hora
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error al obtener turnos vista: ${err.message}`);
    }
  }

  async getTurnoById(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Turno', sql.Int, id);

      const result = await request.query(`
        SELECT * 
        FROM Turnos
        WHERE ID_Turno = @ID_Turno
      `);

      return result.recordset[0] || null;
    } catch (err) {
      throw new Error(`Error al obtener turno con ID ${id}: ${err.message}`);
    }
  }

  async getTurnoByIdVista(idTurno) {
    try {
      const request = new sql.Request();
      request.input('ID_Turno', sql.Int, idTurno);

      const result = await request.query(`
        SELECT 
          t.ID_Turno,
          t.Fecha,
          t.Hora,
          c.Nombre AS Nombre_Cliente,
          c.Apellido AS Apellido_Cliente
        FROM Turnos t
        LEFT JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
        WHERE t.ID_Turno = @ID_Turno
        ORDER BY t.Fecha, t.Hora
      `);

      return result.recordset[0] || null;
    } catch (err) {
      throw new Error(`Error al obtener turno vista con ID ${idTurno}: ${err.message}`);
    }
  }

  async createTurno(turno) {
    try {
      const { ID_Cliente, Fecha, Hora } = turno;
      const horaValue = Hora ? new Date(`1970-01-01T${Hora}`) : null;

      const request = new sql.Request();
      request.input('ID_Cliente', sql.Int, ID_Cliente);
      request.input('Fecha', sql.Date, Fecha);
      request.input('Hora', sql.Time, horaValue);

      const result = await request.query(`
        INSERT INTO Turnos (ID_Cliente, Fecha, Hora)
        VALUES (@ID_Cliente, @Fecha, @Hora);

        SELECT SCOPE_IDENTITY() AS ID_Turno;
      `);

      return { ID_Turno: result.recordset[0].ID_Turno, ...turno };
    } catch (err) {
      throw new Error(`Error al crear turno: ${err.message}`);
    }
  }

  async updateTurno(id, turno) {
    try {
      const { ID_Cliente, Fecha, Hora } = turno;
      const horaValue = Hora ? new Date(`1970-01-01T${Hora}`) : null;

      const request = new sql.Request();
      request.input('ID_Turno', sql.Int, id);
      request.input('ID_Cliente', sql.Int, ID_Cliente);
      request.input('Fecha', sql.Date, Fecha);
      request.input('Hora', sql.Time, horaValue);

      const result = await request.query(`
        UPDATE Turnos
        SET ID_Cliente = @ID_Cliente,
            Fecha = @Fecha,
            Hora = @Hora
        WHERE ID_Turno = @ID_Turno
      `);

      return result.rowsAffected[0] > 0
        ? { ID_Turno: id, ...turno }
        : null;

    } catch (err) {
      throw new Error(`Error al actualizar turno con ID ${id}: ${err.message}`);
    }
  }

  async deleteTurno(id) {
    try {
      const request = new sql.Request();
      request.input('ID_Turno', sql.Int, id);

      const result = await request.query(`
        DELETE FROM Turnos WHERE ID_Turno = @ID_Turno
      `);

      return result.rowsAffected[0] > 0;
    } catch (err) {
      throw new Error(`Error al eliminar turno con ID ${id}: ${err.message}`);
    }
  }
}

module.exports = new TurnosService();
