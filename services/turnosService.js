const { sql } = require('../config/db');

class TurnosService {

  async getAllTurnos(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT t.*
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE c.ID_Centro = @ID_Centro
    `);

    return result.recordset;
  }

  async getTurnosVista(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        t.ID_Turno,
        t.Fecha,
        t.Hora,
        c.Nombre AS Nombre_Cliente,
        c.Apellido AS Apellido_Cliente
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE c.ID_Centro = @ID_Centro
      ORDER BY c.Nombre, c.Apellido, t.Fecha, t.Hora
    `);

    return result.recordset;
  }

  async getTurnoById(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Turno', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT t.*
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE t.ID_Turno = @ID_Turno
        AND c.ID_Centro = @ID_Centro
    `);

    return result.recordset[0] || null;
  }

  async getTurnoByIdVista(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Turno', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        t.ID_Turno,
        t.Fecha,
        t.Hora,
        c.Nombre AS Nombre_Cliente,
        c.Apellido AS Apellido_Cliente
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE t.ID_Turno = @ID_Turno
        AND c.ID_Centro = @ID_Centro
    `);

    return result.recordset[0] || null;
  }

  async createTurno(turno, idCentro) {
    const { ID_Cliente, Fecha, Hora } = turno;

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

    const horaValue = Hora ? new Date(`1970-01-01T${Hora}`) : null;

    request.input('Fecha', sql.Date, Fecha);
    request.input('Hora', sql.Time, horaValue);

    const result = await request.query(`
      INSERT INTO Turnos (ID_Cliente, Fecha, Hora)
      VALUES (@ID_Cliente, @Fecha, @Hora);
      SELECT SCOPE_IDENTITY() AS ID_Turno;
    `);

    return { ID_Turno: result.recordset[0].ID_Turno, ...turno };
  }

  async updateTurno(id, turno, idCentro) {
    const { ID_Cliente, Fecha, Hora } = turno;

    const request = new sql.Request();
    request.input('ID_Turno', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('ID_Cliente', sql.Int, ID_Cliente);
    request.input('Fecha', sql.Date, Fecha);
    request.input('Hora', sql.Time, Hora ? new Date(`1970-01-01T${Hora}`) : null);

    const result = await request.query(`
      UPDATE t
      SET t.ID_Cliente = @ID_Cliente,
          t.Fecha = @Fecha,
          t.Hora = @Hora
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE t.ID_Turno = @ID_Turno
        AND c.ID_Centro = @ID_Centro
    `);

    return result.rowsAffected[0] > 0
      ? { ID_Turno: id, ...turno }
      : null;
  }

  async deleteTurno(id, idCentro) {
    const request = new sql.Request();
    request.input('ID_Turno', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      DELETE t
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE t.ID_Turno = @ID_Turno
        AND c.ID_Centro = @ID_Centro
    `);

    return result.rowsAffected[0] > 0;
  }
}

module.exports = new TurnosService();