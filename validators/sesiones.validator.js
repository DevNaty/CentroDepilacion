function validarCrearSesion(body) {
  const errores = [];

  const { idCliente, fecha, zonas } = body;

  if (!idCliente || !Number.isInteger(idCliente)) {
    errores.push("idCliente es obligatorio y debe ser un número entero");
  }

  if (!fecha || isNaN(Date.parse(fecha))) {
    errores.push("fecha es obligatoria y debe tener formato válido (YYYY-MM-DD)");
  }

  if (!Array.isArray(zonas) || zonas.length === 0) {
    errores.push("zonas debe ser un array con al menos una zona");
  } else {
    zonas.forEach((zona, index) => {
      if (!zona.idZona || !Number.isInteger(zona.idZona)) {
        errores.push(`Zona #${index + 1}: idZona inválido`);
      }

      if (
        zona.potencia === undefined ||
        typeof zona.potencia !== "number" ||
        zona.potencia <= 0
      ) {
        errores.push(`Zona #${index + 1}: potencia debe ser un número mayor a 0`);
      }

      if (zona.notas && typeof zona.notas !== "string") {
        errores.push(`Zona #${index + 1}: notas debe ser texto`);
      }
    });
  }

  return errores;
}

module.exports = {
  validarCrearSesion,
};
