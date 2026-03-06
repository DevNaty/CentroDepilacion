const { sql } = require('../config/db');
const { formatDate, formatTime, timeToSqlDate } = require('../src/utils/dateFormatter');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

class TurnosService {

  // ===============================
  // GET ALL
  // ===============================

  async getAllTurnos(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT t.*
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE c.ID_Centro = @ID_Centro
    `);

    return result.recordset.map(t => ({
      ...t,
      Fecha: formatDate(t.Fecha),
      HoraInicio: formatTime(t.HoraInicio),
      HoraFin: formatTime(t.HoraFin)
    }));
  }

  // ===============================
  // GET VISTA
  // ===============================

  async getTurnosVista(idCentro) {
    const request = new sql.Request();
    request.input('ID_Centro', sql.Int, idCentro);

    const result = await request.query(`
      SELECT 
        c.Nombre AS Nombre_Cliente,
        c.Apellido AS Apellido_Cliente,
        t.ID_Turno,
        t.Fecha,
        t.HoraInicio,
        t.HoraFin,
        z.Nombre_Zona
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      INNER JOIN TurnosZonas tz ON tz.ID_Turno = t.ID_Turno
      INNER JOIN Zonas z ON z.ID_Zona = tz.ID_Zona
      WHERE c.ID_Centro = @ID_Centro
      ORDER BY t.Fecha, t.HoraInicio
    `);

    return result.recordset.map(r => ({
      ...r,
      Fecha: formatDate(r.Fecha),
      HoraInicio: formatTime(r.HoraInicio),
      HoraFin: formatTime(r.HoraFin)
    }));
  }

  // ===============================
  // UPDATE
  // ===============================

  async updateTurno(id, turno, idCentro) {
    const { ID_Cliente, Fecha, HoraInicio, HoraFin } = turno;

    const request = new sql.Request();
    request.input('ID_Turno', sql.Int, id);
    request.input('ID_Centro', sql.Int, idCentro);
    request.input('ID_Cliente', sql.Int, ID_Cliente);
    request.input('Fecha', sql.Date, Fecha);
    request.input('HoraInicio', sql.Time, timeToSqlDate(HoraInicio));
    request.input('HoraFin', sql.Time, timeToSqlDate(HoraFin));

    const result = await request.query(`
      UPDATE t
      SET t.ID_Cliente = @ID_Cliente,
          t.Fecha = @Fecha,
          t.HoraInicio = @HoraInicio,
          t.HoraFin = @HoraFin
      FROM Turnos t
      INNER JOIN Clientes c ON t.ID_Cliente = c.ID_Cliente
      WHERE t.ID_Turno = @ID_Turno
        AND c.ID_Centro = @ID_Centro
    `);

    if (result.rowsAffected[0] === 0) return null;

    return {
      ID_Turno: id,
      ID_Cliente,
      Fecha,
      HoraInicio,
      HoraFin
    };
  }

}

module.exports = new TurnosService();