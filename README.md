
# 📖 Documentación oficial de la API - Centro de Estética y Depilación

Esta documentación detalla los endpoints, flujos y reglas de negocio del sistema de gestión para el centro de depilación láser. El backend está construido sobre **Node.js, Express y SQL Server**.

---

## 📂 PASO 1 – Análisis del Proyecto

### Resumen General
El backend gestiona el ciclo de vida de un cliente en el centro: desde su registro, la gestión de turnos (citas), hasta el registro detallado de las sesiones de tratamiento realizadas.

### Entidades Principales
1.  **Clientes**: Usuarios que reciben el tratamiento.
2.  **Zonas**: Partes del cuerpo tratadas (ej: Axilas, Piernas completas).
3.  **Turnos**: Citas programadas en el calendario.
4.  **Sesiones**: El evento de tratamiento que ocurre en una fecha específica para un cliente.
5.  **Detalles de Sesión**: La información técnica (potencia utilizada, notas) aplicada a una zona específica dentro de una sesión.

### Flujo de Datos
El sistema permite un registro histórico. Un **Cliente** tiene muchos **Turnos** y muchas **Sesiones**. Cada **Sesión** agrupa uno o más **Detalles de Sesión** (uno por cada **Zona** tratada en esa visita).

---

## 🔗 PASO 2 – Documentación de Endpoints

### 🔹 Recurso: Clientes
**Base path:** `/api/clientes`

*   **GET `/api/clientes`**
    *   **Descripción:** Lista básica de todos los clientes.
    *   **Respuesta 200:** `[{"ID_Cliente": 1, "Nombre": "Juan", "Apellido": "Pérez", ...}]`

*   **GET `/api/clientes/listado`**
    *   **Descripción:** (VISTA RECOMENDADA) Obtiene clientes con su última fecha de sesión y zonas tratadas concatenadas. Ideal para la pantalla principal de la App.
    *   **Respuesta 200:**
        ```json
        [{
          "ID_Cliente": 1,
          "Nombre": "Juan",
          "Apellido": "Pérez",
          "Telefono": "11223344",
          "UltimaSesion": "2023-10-25T00:00:00.000Z",
          "Zonas": "Axilas · Cavado"
        }]
        ```

*   **GET `/api/clientes/buscar?q={texto}`**
    *   **Descripción:** Buscador por nombre, apellido, teléfono o email.
    *   **Query Params:** `q` (mínimo 2 caracteres).

*   **GET `/api/clientes/{id}/sesiones`**
    *   **Descripción:** Historial resumido de sesiones de un cliente específico.

---

### 🔹 Recurso: Zonas
**Base path:** `/api/zonas`

*   **GET `/api/zonas`**
    *   **Descripción:** Obtiene el catálogo de zonas disponibles.
    *   **Respuesta 200:** `[{"ID_Zona": 1, "Nombre_Zona": "Axilas"}]`

---

### 🔹 Recurso: Sesiones
**Base path:** `/api/sesiones`

*   **POST `/api/sesiones/completa`** (⭐ **Endpoint Crítico**)
    *   **Descripción:** Crea una sesión y todos sus detalles (zonas y potencias) en una sola transacción.
    *   **Body esperado:**
        ```json
        {
          "ID_Cliente": 1,
          "Fecha": "2023-11-01",
          "Detalles": [
            { "ID_Zona": 2, "Potencia": "14J", "Notas": "Sin molestias" },
            { "ID_Zona": 5, "Potencia": "16J", "Notas": "Aumentó potencia" }
          ]
        }
        ```

*   **GET `/api/sesiones/{id}/detalles`**
    *   **Descripción:** Obtiene toda la información de una sesión específica, incluyendo el array de zonas tratadas.

---

### 🔹 Recurso: Turnos (Citas)
**Base path:** `/api/turnos`

*   **GET `/api/turnos`**
    *   **Descripción:** Obtiene la lista de todos los turnos programados.
*   **POST `/api/turnos`**
    *   **Body:** `{"ID_Cliente": 1, "Fecha": "2023-12-01", "Hora": "15:30"}`

---

## 🔄 PASO 3 – Relaciones Importantes

Para que la App Android funcione correctamente, se debe seguir este orden lógico:

1.  **Registro/Selección**: Primero se debe identificar al **Cliente**. Si es nuevo, usar `POST /api/clientes`.
2.  **Preparación de Sesión**: Consultar `GET /api/zonas` para mostrar al usuario qué partes del cuerpo se pueden tratar.
3.  **Ejecución**: Al finalizar el tratamiento, enviar los datos mediante `POST /api/sesiones/completa`. 
    *   *Nota*: No se recomienda usar los endpoints de `/api/detallesSesiones` individualmente, ya que el endpoint `/completa` garantiza que no queden sesiones vacías o datos huérfanos.

---

## 📱 PASO 4 – Guía para Android Frontend

### Recomendación de Modelos (DTOs)

**ClientDTO:**
*   `Integer ID_Cliente` (Null para nuevos)
*   `String Nombre`, `String Apellido`, `String Telefono`

**SessionRequest:** (Para el POST completo)
*   `int idCliente`
*   `String fecha` (Formato ISO YYYY-MM-DD)
*   `List<ZoneDetail> detalles`

### Campos Obligatorios vs Opcionales
*   **Clientes**: Nombre y Apellido son obligatorios. Notas es opcional.
*   **Sesiones**: La Potencia en cada zona es obligatoria para el registro técnico.

---

## ⚠️ PASO 5 – Detección de Problemas y Faltantes

Analizando el código fuente, se detectaron los siguientes puntos que el desarrollador Android debe tener en cuenta:

### ❌ Problemas Detectados
1.  **Inconsistencia de Nombres (Case Sensitivity)**: El validador `sesiones.validator.js` espera campos en camelCase (`idCliente`, `idZona`), pero los servicios de Base de Datos y los controladores suelen usar PascalCase (`ID_Cliente`, `ID_Zona`). **Peligro**: Si envías `ID_Cliente` al endpoint de validación, fallará.
2.  **Error en Rutas de Turnos**: En `app.js` se importa `turnosRoutes`, pero en el archivo `routes/turnos.js` se observa un error de sintaxis en el import del controlador (`turnosController.` con un punto al final) y el comentario interno dice `zonaRoutes.js`.
3.  **Inconsistencia en Sesiones Service**: El controlador de sesiones llama a `SesionesService.createSesiones` (plural), pero en el archivo del servicio la función está definida como `createSesion` (singular). Esto romperá el flujo de creación simple de sesiones.

### 🟡 Cosas Incompletas
1.  **Falta de Autenticación**: La API no requiere Token (JWT) ni API Key. Al ser de uso interno, se recomienda que la App se use solo en red VPN o local.
2.  **Manejo de Tipos en Horas**: El servicio de Turnos intenta convertir la hora con `new Date('1970-01-01T' + Hora)`. El frontend debe enviar la hora estrictamente en formato `HH:mm`.
3.  **Eliminación Cruda**: El borrado de clientes (`deleteCliente`) no parece verificar si el cliente tiene sesiones. Podría causar un error de integridad referencial en SQL Server.

### ✅ Lo que está bien implementado
1.  **Transacciones**: El método `createSesionCompleta` usa `sql.Transaction`, lo cual es excelente para asegurar que si falla la carga de una zona, no se cree la sesión a medias.
2.  **Buscador Optimizado**: El endpoint de `/buscar` usa `LIKE %texto%` sobre múltiples columnas, lo que facilita mucho la experiencia de usuario en Android.
3.  **Separación de Capas**: El código está bien organizado en Rutas -> Controladores -> Servicios, facilitando el mantenimiento.

---

## 📄 PASO 6 – Formato Final
Esta documentación sirve como contrato entre Backend y Frontend. Se recomienda utilizar **Retrofit2** en Android con la librería **Gson** para el mapeo de los JSON aquí descritos.
