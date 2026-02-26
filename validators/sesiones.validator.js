// validators/sesiones.validator.js
function validarCrearSesion(body) {
  const errores = [];

  const { ID_Cliente, Fecha, Detalles } = body;

  // ✅ ID_Cliente
  if (
    ID_Cliente === undefined ||
    ID_Cliente === null ||
    !Number.isInteger(Number(ID_Cliente))
  ) {
    errores.push("ID_Cliente es obligatorio y debe ser un número entero");
  }

  // ✅ Fecha
  if (
    !Fecha ||
    typeof Fecha !== "string" ||
    isNaN(Date.parse(Fecha))
  ) {
    errores.push("Fecha es obligatoria y debe tener formato válido (YYYY-MM-DD)");
  }

  // ✅ Detalles
  if (!Array.isArray(Detalles) || Detalles.length === 0) {
    errores.push("Detalles debe ser un array con al menos un detalle");
  } else {
    Detalles.forEach((detalle, index) => {

      // ID_Zona
      if (
        detalle.ID_Zona === undefined ||
        detalle.ID_Zona === null ||
        !Number.isInteger(Number(detalle.ID_Zona))
      ) {
        errores.push(
          `Detalle #${index + 1}: ID_Zona es obligatorio y debe ser un número entero`
        );
      }

      // Potencia (ahora como string, porque tu SQL usa VarChar)
      if (
        detalle.Potencia === undefined ||
        typeof detalle.Potencia !== "string" ||
        detalle.Potencia.trim() === ""
      ) {
        errores.push(
          `Detalle #${index + 1}: Potencia es obligatoria y debe ser texto`
        );
      }

      // Notas (opcional)
      if (
        detalle.Notas !== undefined &&
        detalle.Notas !== null &&
        typeof detalle.Notas !== "string"
      ) {
        errores.push(
          `Detalle #${index + 1}: Notas debe ser texto`
        );
      }
    });
  }

  return errores;
}

module.exports = {
  validarCrearSesion,
};