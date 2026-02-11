function validarCrearSesion(body) {
  const errores = [];

  const { ID_Cliente, Fecha, Zonas } = body;

  if (!ID_Cliente || !Number.isInteger(ID_Cliente)) {
    errores.push("ID_Cliente es obligatorio y debe ser un número entero");
  }

  if (!Fecha || isNaN(Date.parse(Fecha))) {
    errores.push("Fecha es obligatoria y debe tener formato válido (YYYY-MM-DD)");
  }

  if (!Array.isArray(Zonas) || Zonas.length === 0) {
    errores.push("Zonas debe ser un array con al menos una zona");
  } else {
    Zonas.forEach((zona, index) => {
      if (!zona.ID_Zona || !Number.isInteger(zona.ID_Zona)) {
        errores.push(`Zona #${index + 1}: ID_Zona inválido`);
      }

      if (
        zona.Potencia === undefined ||
        typeof zona.Potencia !== "number" ||
        zona.Potencia <= 0
      ) {
        errores.push(`Zona #${index + 1}: Potencia debe ser un número mayor a 0`);
      }

      if (zona.Notas && typeof zona.Notas !== "string") {
        errores.push(`Zona #${index + 1}: Notas debe ser texto`);
      }
    });
  }

  return errores;
}

module.exports = {
  validarCrearSesion,
};
