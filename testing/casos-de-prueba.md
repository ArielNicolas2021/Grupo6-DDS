| ID     | Descripción                                      | Pasos                                                                 | Resultado Esperado |
|--------|--------------------------------------------------|-----------------------------------------------------------------------|--------------------|
| TC-001 | Registro exitoso de usuario                      | 1. Acceder a registro 2. Ingresar email válido 3. Ingresar contraseña válida 4. Enviar formulario | Usuario creado correctamente. HTTP 201 |
| TC-002 | Registro con email duplicado                     | 1. Acceder a registro 2. Ingresar email ya registrado 3. Completar formulario 4. Enviar | Error HTTP 409 indicando duplicado |
| TC-003 | Registro con campos obligatorios vacíos          | 1. Acceder a registro 2. Dejar campos vacíos 3. Enviar | Error HTTP 400 con mensaje de validación |
| TC-004 | Login exitoso                                    | 1. Acceder a login 2. Ingresar credenciales válidas 3. Enviar | Retorna token JWT válido. HTTP 200 |
| TC-005 | Login con credenciales inválidas                 | 1. Acceder a login 2. Ingresar contraseña incorrecta 3. Enviar | Error HTTP 401 |
| TC-006 | Acceso a endpoint protegido con token válido     | 1. Loguearse 2. Enviar request con token válido 3. Acceder recurso | Acceso permitido. HTTP 200 |
| TC-007 | Acceso con token expirado                        | 1. Usar token expirado 2. Acceder recurso protegido | Error HTTP 401 |
| TC-008 | Creación de gasto válida                         | 1. Loguearse 2. Crear gasto con monto numérico, categoría y fecha válidos | Gasto creado correctamente. HTTP 201 |
| TC-009 | Creación de gasto con monto inválido             | 1. Loguearse 2. Crear gasto con monto en texto 3. Enviar | Error HTTP 400 indicando tipo inválido |
| TC-010 | Creación de gasto con campos faltantes           | 1. Loguearse 2. Omitir categoría o monto 3. Enviar | Error HTTP 400 |
| TC-011 | Visualización de lista de gastos                 | 1. Loguearse 2. Solicitar lista de gastos | Lista retornada correctamente. HTTP 200 |
| TC-012 | Edición de gasto existente                       | 1. Loguearse 2. Editar un gasto válido 3. Guardar cambios | Gasto actualizado correctamente. HTTP 200 |
| TC-013 | Eliminación de gasto                             | 1. Loguearse 2. Eliminar gasto existente | Gasto eliminado correctamente. HTTP 200 o 204 |
| TC-014 | Acceso a gasto de otro usuario                   | 1. Loguearse como usuario A 2. Intentar acceder gasto de usuario B | Error HTTP 403 |
| TC-015 | Consulta de gasto inexistente                    | 1. Loguearse 2. Consultar ID inexistente | Error HTTP 404 |
| TC-016 | Acceso sin autenticación                         | 1. No loguearse 2. Intentar acceder endpoint protegido | Error HTTP 401 |
| TC-017 | Eliminación de usuario por administrador         | 1. Loguearse como admin 2. Eliminar usuario 3. Intentar login con ese usuario | Error HTTP 401 |
| TC-018 | Validación de formato de email                   | 1. Ingresar email inválido 2. Enviar registro | Error HTTP 400 |
| TC-019 | Envío de datos con longitud inválida             | 1. Ingresar contraseña muy corta 2. Enviar | Error HTTP 400 |
| TC-020 | Manejo de error interno del servidor             | 1. Forzar error en backend (si aplica) 2. Enviar request | Error HTTP 500 sin exponer detalles internos |