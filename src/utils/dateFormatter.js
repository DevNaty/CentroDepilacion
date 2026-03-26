const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

// Fecha → DD-MM-YYYY
function formatDate(date) {
  if (!date) return null;
  return dayjs(date).utc().format('DD-MM-YYYY');
}

// Hora → HH:mm:ss (24hs)
function formatTime(time) {
  if (!time) return null;
  return dayjs(time).utc().format('HH:mm:ss');
}

// Convierte "HH:mm:ss" → Date compatible con SQL TIME
function timeToSqlDate(timeString) {
  if (!timeString) return null;
  return dayjs.utc(timeString, 'HH:mm:ss').toDate();
}

module.exports = {
  formatDate,
  formatTime,
  timeToSqlDate
};