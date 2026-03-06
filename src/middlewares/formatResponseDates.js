const { formatDateTime } = require('../utils/dateFormatter');

function formatDatesInObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key in obj) {
    const value = obj[key];

    if (value instanceof Date) {
      obj[key] = formatDateTime(value);
    } else if (Array.isArray(value)) {
      value.forEach(item => formatDatesInObject(item));
    } else if (typeof value === 'object') {
      formatDatesInObject(value);
    }
  }

  return obj;
}

function formatResponseDates(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    const formattedData = formatDatesInObject(data);
    return originalJson.call(this, formattedData);
  };

  next();
}

module.exports = formatResponseDates;