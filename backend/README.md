# Finance App — Documentación de API

Sistema de gestión financiera personal. Permite registrar gastos e ingresos, organizarlos por categorías y consultar el balance financiero.

---

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.4 |
| Spring Security + JWT | JJWT 0.12.5 |
| Spring Data JPA | incluido |
| Base de datos | H2 (desarrollo) / MySQL (producción) |
| Build | Maven |

---

## Inicio rápido

```bash
# Levantar el servidor
mvn spring-boot:run

# Servidor disponible en:
http://localhost:8080

# Consola H2 (solo desarrollo):
http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:financedb | User: sa | Password: (vacío)
```

---

## Autenticación

La API usa **JWT Bearer Token**. Flujo obligatorio:

```
1. POST /auth/register  →  crear cuenta
2. POST /auth/login     →  obtener token
3. Incluir token en cada request protegido:
   Authorization: Bearer {token}
```

El token tiene una validez de **24 horas**.

---

## Referencia de endpoints

### Resumen general

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |
| POST | /api/gastos | Crear gasto | Sí |
| GET | /api/gastos | Listar gastos | Sí |
| GET | /api/gastos/{id} | Obtener gasto por ID | Sí |
| PUT | /api/gastos/{id} | Actualizar gasto | Sí |
| DELETE | /api/gastos/{id} | Eliminar gasto | Sí |
| GET | /api/gastos/por-fecha | Gastos por rango de fechas | Sí |
| GET | /api/gastos/categoria/{id} | Gastos por categoría | Sí |
| POST | /api/ingresos | Crear ingreso | Sí |
| GET | /api/ingresos | Listar ingresos | Sí |
| GET | /api/ingresos/{id} | Obtener ingreso por ID | Sí |
| PUT | /api/ingresos/{id} | Actualizar ingreso | Sí |
| DELETE | /api/ingresos/{id} | Eliminar ingreso | Sí |
| POST | /api/categorias | Crear categoría | Sí |
| GET | /api/categorias | Listar categorías disponibles | Sí |
| DELETE | /api/categorias/{id} | Eliminar categoría | Sí |
| GET | /api/dashboard/balance | Balance financiero | Sí |

---

## Auth

### POST /auth/register

Crea una nueva cuenta de usuario.

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "Segura@123"
}
```

**Reglas de contraseña:** mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (`@$!%*?&._-`).

**Response 201:**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "fechaRegistro": "2024-05-01T10:00:00",
  "mensaje": "Usuario registrado exitosamente"
}
```

| Código | Motivo |
|---|---|
| 201 | Registro exitoso |
| 400 | Email inválido o contraseña débil |
| 409 | El email ya está registrado |

---

### POST /auth/login

Autentica al usuario y devuelve un JWT.

**Request:**
```json
{
  "email": "juan@mail.com",
  "password": "Segura@123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "email": "juan@mail.com",
  "userId": 1,
  "expiracion": "2024-05-02T10:00:00.000+00:00"
}
```

> Guardá el `token`. Es necesario en todos los endpoints que requieren autenticación.

| Código | Motivo |
|---|---|
| 200 | Login exitoso |
| 400 | Campos faltantes o formato inválido |
| 401 | Credenciales incorrectas |

---

## Gastos

Todos los endpoints requieren: `Authorization: Bearer {token}`

---

### POST /api/gastos

Registra un nuevo gasto.

**Request:**
```json
{
  "monto": 1500.00,
  "descripcion": "Supermercado Día",
  "fecha": "2024-05-01",
  "categoriaId": 1,
  "numeroReferencia": "TKT-0042"
}
```

> `numeroReferencia` es opcional.

**Response 201:**
```json
{
  "id": 1,
  "monto": 1500.00,
  "descripcion": "Supermercado Día",
  "fecha": "2024-05-01",
  "numeroReferencia": "TKT-0042",
  "fechaRegistro": "2024-05-01T10:30:00",
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "categoriaId": 1,
  "categoriaNombre": "Alimentación"
}
```

| Código | Motivo |
|---|---|
| 201 | Gasto creado |
| 400 | Monto inválido, descripción vacía o fecha futura |
| 401 | Token ausente o inválido |
| 404 | Categoría no encontrada |

---

### GET /api/gastos

Lista todos los gastos del usuario autenticado, ordenados por fecha descendente.

**Sin body.**

**Response 200:**
```json
[
  { "id": 2, "monto": 2500.00, "descripcion": "Alquiler",     "fecha": "2024-05-05", "categoriaNombre": "Vivienda" },
  { "id": 1, "monto": 1500.00, "descripcion": "Supermercado", "fecha": "2024-05-01", "categoriaNombre": "Alimentación" }
]
```

> Devuelve `[]` si no hay gastos.

---

### GET /api/gastos/{id}

Obtiene un gasto por ID.

**Response 200:** mismo formato que un ítem de la lista.

| Código | Motivo |
|---|---|
| 200 | Gasto encontrado |
| 403 | El gasto pertenece a otro usuario |
| 404 | Gasto no encontrado |

---

### PUT /api/gastos/{id}

Actualiza un gasto. Solo se modifican los campos enviados — los demás conservan su valor.

**Request (parcial o completo):**
```json
{
  "monto": 2000.00,
  "categoriaId": 3
}
```

**Response 200:** gasto actualizado completo.

| Código | Motivo |
|---|---|
| 200 | Actualización exitosa |
| 400 | Datos inválidos |
| 403 | El gasto pertenece a otro usuario |
| 404 | Gasto o categoría no encontrados |

---

### DELETE /api/gastos/{id}

Elimina un gasto. Responde sin body.

| Código | Motivo |
|---|---|
| 204 | Eliminado correctamente |
| 403 | El gasto pertenece a otro usuario |
| 404 | Gasto no encontrado |

---

### GET /api/gastos/por-fecha

Filtra gastos por rango de fechas (ambas fechas inclusive).

**Rangos predefinidos** (parámetro `tipo`):

```
GET /api/gastos/por-fecha?tipo=DIA       → hoy
GET /api/gastos/por-fecha?tipo=SEMANA    → lunes a domingo de la semana actual
GET /api/gastos/por-fecha?tipo=MES       → primer al último día del mes actual
GET /api/gastos/por-fecha?tipo=ANIO      → 1 enero al 31 diciembre del año actual
```

**Rango personalizado** (parámetros `desde` y `hasta`):

```
GET /api/gastos/por-fecha?desde=2024-01-01&hasta=2024-03-31
```

**Response 200:**
```json
{
  "desde": "2024-05-01",
  "hasta": "2024-05-31",
  "cantidad": 2,
  "total": 4000.00,
  "gastos": [
    { "id": 2, "monto": 2500.00, "descripcion": "Alquiler",     "fecha": "2024-05-05" },
    { "id": 1, "monto": 1500.00, "descripcion": "Supermercado", "fecha": "2024-05-01" }
  ]
}
```

| Código | Motivo |
|---|---|
| 200 | Consulta exitosa |
| 400 | `desde` posterior a `hasta`, o tipo inválido |

---

### GET /api/gastos/categoria/{categoriaId}

Lista todos los gastos del usuario en una categoría específica.

**Sin body.**

**Response 200:**
```json
{
  "categoriaId": 1,
  "categoriaNombre": "Alimentación",
  "cantidad": 2,
  "total": 3200.00,
  "gastos": [
    { "id": 2, "monto": 1700.00, "descripcion": "Coto",         "fecha": "2024-05-10" },
    { "id": 1, "monto": 1500.00, "descripcion": "Supermercado", "fecha": "2024-05-01" }
  ]
}
```

> Devuelve `gastos: []` y `total: 0` si no hay gastos en esa categoría.

| Código | Motivo |
|---|---|
| 200 | Consulta exitosa |
| 404 | Categoría no encontrada o no visible para el usuario |

---

## Ingresos

Todos los endpoints requieren: `Authorization: Bearer {token}`

---

### POST /api/ingresos

Registra un nuevo ingreso.

**Request:**
```json
{
  "monto": 150000.00,
  "descripcion": "Cobro de salario",
  "fecha": "2024-05-01",
  "categoriaId": 7,
  "fuente": "Empresa S.A."
}
```

> `descripcion` y `fuente` son opcionales.

**Response 201:**
```json
{
  "id": 1,
  "monto": 150000.00,
  "descripcion": "Cobro de salario",
  "fecha": "2024-05-01",
  "fuente": "Empresa S.A.",
  "fechaRegistro": "2024-05-01T09:00:00",
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "categoriaId": 7,
  "categoriaNombre": "Salario"
}
```

| Código | Motivo |
|---|---|
| 201 | Ingreso creado |
| 400 | Monto inválido o fecha futura |
| 401 | Token ausente o inválido |
| 404 | Categoría no encontrada |

---

### GET /api/ingresos

Lista todos los ingresos del usuario autenticado, ordenados por fecha descendente.

**Response 200:** lista de ingresos. Devuelve `[]` si no hay registros.

---

### GET /api/ingresos/{id}

Obtiene un ingreso por ID.

| Código | Motivo |
|---|---|
| 200 | Ingreso encontrado |
| 403 | El ingreso pertenece a otro usuario |
| 404 | Ingreso no encontrado |

---

### PUT /api/ingresos/{id}

Actualiza un ingreso. Solo se modifican los campos enviados.

**Request (parcial o completo):**
```json
{
  "monto": 160000.00,
  "descripcion": "Salario + bono"
}
```

| Código | Motivo |
|---|---|
| 200 | Actualización exitosa |
| 403 | El ingreso pertenece a otro usuario |
| 404 | Ingreso o categoría no encontrados |

---

### DELETE /api/ingresos/{id}

Elimina un ingreso. Responde sin body.

| Código | Motivo |
|---|---|
| 204 | Eliminado correctamente |
| 403 | El ingreso pertenece a otro usuario |
| 404 | Ingreso no encontrado |

---

## Categorías

Todos los endpoints requieren: `Authorization: Bearer {token}`

Existen dos tipos de categorías:
- **Globales** (`esGlobal: true`) — creadas por el sistema, visibles para todos, no se pueden eliminar.
- **Personales** (`esGlobal: false`) — creadas por el usuario, solo visibles para él.

### Categorías globales disponibles

| ID | Nombre | Tipo |
|---|---|---|
| 1 | Alimentación | GASTO |
| 2 | Transporte | GASTO |
| 3 | Vivienda | GASTO |
| 4 | Salud | GASTO |
| 5 | Entretenimiento | GASTO |
| 6 | Educación | AMBOS |
| 7 | Salario | INGRESO |
| 8 | Freelance | INGRESO |
| 9 | Inversiones | INGRESO |
| 10 | Otros | AMBOS |

> Los IDs pueden variar. Usar `GET /api/categorias` para obtener los valores reales.

---

### POST /api/categorias

Crea una categoría personal para el usuario autenticado.

**Request:**
```json
{
  "nombre": "Delivery",
  "tipo": "GASTO",
  "descripcion": "Pedidos por aplicación"
}
```

> Valores válidos para `tipo`: `GASTO`, `INGRESO`, `AMBOS`.

**Response 201:**
```json
{
  "id": 11,
  "nombre": "Delivery",
  "tipo": "GASTO",
  "descripcion": "Pedidos por aplicación",
  "activa": true,
  "esGlobal": false
}
```

| Código | Motivo |
|---|---|
| 201 | Categoría creada |
| 400 | Nombre vacío o tipo inválido |
| 409 | Ya existe una categoría con ese nombre |

---

### GET /api/categorias

Lista todas las categorías disponibles para el usuario: sus categorías personales + las globales del sistema.

**Response 200:**
```json
[
  { "id": 1,  "nombre": "Alimentación", "tipo": "GASTO",   "esGlobal": true  },
  { "id": 7,  "nombre": "Salario",      "tipo": "INGRESO", "esGlobal": true  },
  { "id": 11, "nombre": "Delivery",     "tipo": "GASTO",   "esGlobal": false }
]
```

---

### DELETE /api/categorias/{id}

Elimina una categoría personal. No se pueden eliminar categorías globales del sistema.

| Código | Motivo |
|---|---|
| 204 | Eliminada correctamente |
| 403 | Es una categoría global o pertenece a otro usuario |
| 404 | Categoría no encontrada |
| 409 | La categoría tiene gastos o ingresos asociados |

---

## Dashboard

### GET /api/dashboard/balance

Devuelve el balance financiero del usuario autenticado.

**Sin body.**

**Response 200:**
```json
{
  "totalIngresos": 150000.00,
  "totalGastos":    54850.00,
  "balance":        95150.00,
  "cantidadIngresos": 1,
  "cantidadGastos":   5
}
```

> `balance` positivo = superávit. `balance` negativo = déficit.

| Código | Motivo |
|---|---|
| 200 | Balance calculado correctamente |
| 401 | Token ausente o inválido |

---

## Formato de errores

Todos los errores siguen el mismo esquema:

```json
{
  "status": 400,
  "error": "Bad Request",
  "mensaje": "Error de validación en los datos enviados",
  "detalles": [
    "El monto debe ser mayor a cero",
    "La descripción es obligatoria"
  ],
  "timestamp": "2024-05-01T10:30:00",
  "path": "/api/gastos"
}
```

> El campo `detalles` solo aparece en errores de validación (400). En el resto solo aparece `mensaje`.

### Códigos de error utilizados

| Código | Significado | Casos |
|---|---|---|
| 400 | Bad Request | Datos inválidos, campos faltantes |
| 401 | Unauthorized | Token ausente, expirado o inválido |
| 403 | Forbidden | Recurso de otro usuario, categoría global |
| 404 | Not Found | Recurso inexistente |
| 409 | Conflict | Email duplicado, categoría duplicada, categoría con movimientos |
| 500 | Internal Server Error | Error inesperado del servidor |

---

## Flujo completo con curl

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@mail.com","password":"Segura@123"}'

# 2. Login — guardar token en variable
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@mail.com","password":"Segura@123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 3. Crear un gasto
curl -X POST http://localhost:8080/api/gastos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monto":1500,"descripcion":"Supermercado","fecha":"2024-05-01","categoriaId":1}'

# 4. Registrar un ingreso
curl -X POST http://localhost:8080/api/ingresos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monto":150000,"descripcion":"Salario","fecha":"2024-05-01","categoriaId":7}'

# 5. Ver balance
curl http://localhost:8080/api/dashboard/balance \
  -H "Authorization: Bearer $TOKEN"

# 6. Gastos del mes actual
curl "http://localhost:8080/api/gastos/por-fecha?tipo=MES" \
  -H "Authorization: Bearer $TOKEN"

# 7. Gastos de una categoría
curl http://localhost:8080/api/gastos/categoria/1 \
  -H "Authorization: Bearer $TOKEN"
```
