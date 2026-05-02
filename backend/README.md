# Finance App — API REST

Sistema de gestión financiera personal. Backend desarrollado con Spring Boot, Spring Security y JWT.

---

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.4 |
| Spring Security | incluido |
| JWT (JJWT) | 0.12.5 |
| Spring Data JPA | incluido |
| Base de datos | H2 (desarrollo) / MySQL (producción) |
| Build | Maven |

---

## Levantar el proyecto

```bash
# Clonar e iniciar
mvn spring-boot:run

# El servidor queda disponible en:
http://localhost:8080

# Consola H2 (base de datos en memoria):
http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:financedb  |  User: sa  |  Password: (vacío)
```

---

## Autenticación

La API usa **JWT Bearer Token**. El flujo es:

```
1. POST /auth/register  →  crear cuenta
2. POST /auth/login     →  obtener token
3. Usar el token en el header de cada request protegido:
   Authorization: Bearer {token}
```

---

## Endpoints

### Auth — público, no requiere token

---

#### Registrar usuario

```
POST /auth/register
```

**Request body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "Segura@123"
}
```

**Reglas de contraseña:**
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial: `@$!%*?&._-`

**Response 201 Created:**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "fechaRegistro": "2024-05-01T10:00:00",
  "mensaje": "Usuario registrado exitosamente"
}
```

**Errores posibles:**

| Código | Motivo |
|---|---|
| 400 | Email inválido o contraseña no cumple las reglas |
| 409 | El email ya está registrado |

---

#### Login

```
POST /auth/login
```

**Request body:**
```json
{
  "email": "juan@mail.com",
  "password": "Segura@123"
}
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "email": "juan@mail.com",
  "userId": 1,
  "expiracion": "2024-05-02T10:00:00.000+00:00"
}
```

> **Importante:** Guardá el valor de `token`. Lo necesitás en todos los endpoints siguientes.

**Errores posibles:**

| Código | Motivo |
|---|---|
| 400 | Campos faltantes o formato inválido |
| 401 | Email o contraseña incorrectos |

---

### Gastos — requieren token JWT

Todos los endpoints de gastos requieren el header:
```
Authorization: Bearer {token}
```

---

#### Crear gasto

```
POST /api/gastos
```

**Request body:**
```json
{
  "monto": 1500.00,
  "descripcion": "Supermercado Día",
  "fecha": "2024-05-01",
  "categoriaId": 1,
  "numeroReferencia": "TKT-0042"
}
```

> `numeroReferencia` es opcional. El resto de los campos son obligatorios.

**Response 201 Created:**
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

**Errores posibles:**

| Código | Motivo |
|---|---|
| 400 | Monto <= 0, descripción vacía, fecha futura |
| 401 | Token ausente o inválido |
| 404 | La categoría no existe |

---

#### Listar gastos

```
GET /api/gastos
```

Devuelve los gastos del usuario autenticado, ordenados por fecha descendente (más recientes primero).

**Sin body.**

**Response 200 OK:**
```json
[
  {
    "id": 3,
    "monto": 2500.00,
    "descripcion": "Alquiler",
    "fecha": "2024-05-01",
    "categoriaNombre": "Vivienda"
  },
  {
    "id": 1,
    "monto": 1500.00,
    "descripcion": "Supermercado Día",
    "fecha": "2024-04-15",
    "categoriaNombre": "Alimentación"
  }
]
```

> Si no hay gastos, devuelve `[]` (lista vacía), nunca `null`.

---

#### Obtener gasto por ID

```
GET /api/gastos/{id}
```

**Sin body.**

**Response 200 OK:** mismo formato que un ítem de la lista.

**Errores posibles:**

| Código | Motivo |
|---|---|
| 401 | Token ausente o inválido |
| 403 | El gasto existe pero pertenece a otro usuario |
| 404 | El gasto no existe |

---

#### Actualizar gasto

```
PUT /api/gastos/{id}
```

Todos los campos son **opcionales**: solo se actualizan los que se envían. Los campos no incluidos en el body mantienen su valor actual.

**Request body (ejemplo parcial):**
```json
{
  "monto": 2000.00,
  "categoriaId": 3
}
```

**Request body (ejemplo completo):**
```json
{
  "monto": 2000.00,
  "descripcion": "Supermercado Coto",
  "fecha": "2024-05-02",
  "categoriaId": 3,
  "numeroReferencia": "TKT-0099"
}
```

**Response 200 OK:** gasto actualizado con todos sus campos.

**Errores posibles:**

| Código | Motivo |
|---|---|
| 400 | Monto <= 0 o descripción vacía (si se envían) |
| 401 | Token ausente o inválido |
| 403 | El gasto pertenece a otro usuario |
| 404 | El gasto o la categoría no existen |

---

#### Eliminar gasto

```
DELETE /api/gastos/{id}
```

**Sin body.**

**Response 204 No Content** — sin body en la respuesta.

**Errores posibles:**

| Código | Motivo |
|---|---|
| 401 | Token ausente o inválido |
| 403 | El gasto pertenece a otro usuario |
| 404 | El gasto no existe |

---

## Categorías disponibles

Las categorías se cargan automáticamente al iniciar la aplicación. IDs de referencia:

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

> Los IDs pueden variar. Consultá `GET /api/categorias` para obtener la lista actualizada.

---

## Formato de errores

Todos los errores siguen el mismo formato:

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

> El campo `detalles` solo aparece en errores de validación (400). En los demás errores solo aparece `mensaje`.

---

## Ejemplo de flujo completo con curl

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@mail.com","password":"Segura@123"}'

# 2. Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@mail.com","password":"Segura@123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 3. Crear gasto
curl -X POST http://localhost:8080/api/gastos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monto":1500,"descripcion":"Supermercado","fecha":"2024-05-01","categoriaId":1}'

# 4. Listar gastos
curl http://localhost:8080/api/gastos \
  -H "Authorization: Bearer $TOKEN"

# 5. Actualizar gasto (ID 1)
curl -X PUT http://localhost:8080/api/gastos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monto":2000}'

# 6. Eliminar gasto (ID 1)
curl -X DELETE http://localhost:8080/api/gastos/1 \
  -H "Authorization: Bearer $TOKEN"
```
