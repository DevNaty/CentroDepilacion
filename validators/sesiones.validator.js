// validators/sesiones.validator.js
function validarCrearSesion(body) {
  const errores = [];

  const { ID_Cliente, Fecha, Zonas } = body;

  // ID_Cliente
  if (
    ID_Cliente === undefined ||
    ID_Cliente === null ||
    !Number.isInteger(Number(ID_Cliente))
  ) {
    errores.push("ID_Cliente es obligatorio y debe ser un número entero");
  }

  // Fecha
  if (
    !Fecha ||
    typeof Fecha !== "string" ||
    isNaN(Date.parse(Fecha))
  ) {
    errores.push("Fecha es obligatoria y debe tener un formato válido (YYYY-MM-DD)");
  }

  // Zonas
  if (!Array.isArray(Zonas) || Zonas.length === 0) {
    errores.push("Zonas debe ser un array con al menos una zona");
  } else {
    Zonas.forEach((zona, index) => {
      // ID_Zona
      if (
        zona.ID_Zona === undefined ||
        zona.ID_Zona === null ||
        !Number.isInteger(Number(zona.ID_Zona))
      ) {
        errores.push(`Zona #${index + 1}: ID_Zona es obligatorio y debe ser un número entero`);
      }

      // Potencia
      if (
        zona.Potencia === undefined ||
        typeof zona.Potencia !== "number" ||
        zona.Potencia <= 0
      ) {
        errores.push(`Zona #${index + 1}: Potencia debe ser un número mayor a 0`);
      }

      // Notas
      if (zona.Notas !== undefined && typeof zona.Notas !== "string") {
        errores.push(`Zona #${index + 1}: Notas debe ser texto`);
      }
    });
  }

  return errores;
}

module.exports = {
  validarCrearSesion,
};
