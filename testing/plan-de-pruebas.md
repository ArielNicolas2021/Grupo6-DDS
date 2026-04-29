# Plan de Pruebas de Software
### Proyecto: Gestor de Gastos
**Versión:** 1.0.0
**Fecha:** 2026-04-29
**Autor:** QA Team
**Estado:** Borrador

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Alcance del Plan de Pruebas](#2-alcance-del-plan-de-pruebas)
3. [Funcionalidades a Probar](#3-funcionalidades-a-probar)
4. [Estrategia de Pruebas con Jest](#4-estrategia-de-pruebas-con-jest)
5. [Estructura del Proyecto de Testing](#5-estructura-del-proyecto-de-testing)
6. [Criterios de Aceptación y Cobertura](#6-criterios-de-aceptación-y-cobertura)
7. [Entorno de Ejecución](#7-entorno-de-ejecución)
8. [Roles y Responsabilidades](#8-roles-y-responsabilidades)
9. [Gestión de Defectos](#9-gestión-de-defectos)
10. [Entregables](#10-entregables)

---

## 1. Introducción

### 1.1 Propósito

Este documento define el Plan de Pruebas para el proyecto Gestor de Gastos. Su objetivo es establecer la estrategia, alcance, recursos y cronograma necesarios para garantizar la calidad del software mediante un proceso de testing estructurado y automatizado utilizando **Jest**.

### 1.2 Objetivos de Calidad

- Detectar y reportar defectos antes del despliegue a producción.
- Validar que todas las funcionalidades críticas operen según los requisitos definidos.
- Asegurar una cobertura de código mínima del **80%**.
- Garantizar la estabilidad del sistema frente a casos límite y errores esperados.

### 1.3 Referencias

| Documento | Descripción |
|-----------|-------------|
| Especificación de Requisitos | Documento de requerimientos funcionales |
| Arquitectura del Sistema | Diagrama de componentes y servicios |
| Guía de Estilo de Código | Convenciones del equipo de desarrollo |

---

## 2. Alcance del Plan de Pruebas

### 2.1 Módulos y Componentes en Alcance

Los siguientes módulos serán cubiertos por este plan de pruebas:

| Módulo | Tipo de Prueba | Prioridad |
|--------|---------------|-----------|
| Autenticación y autorización | Unitaria + Integración | Alta |
| Gestión de usuarios (CRUD) | Unitaria + Integración | Alta |
| Módulo de negocio principal | Unitaria | Alta |
| Capa de servicios / API | Integración + Mocks | Alta |
| Utilidades y helpers | Unitaria | Media |
| Manejo de errores y excepciones | Unitaria | Alta |
| Validaciones de entrada (schemas) | Unitaria | Media |

### 2.2 Fuera del Alcance

Las siguientes áreas **no** forman parte de este plan de pruebas:

- Pruebas de rendimiento y carga (performance testing).
- Pruebas de UI/E2E (se gestionan en un plan separado con Playwright/Cypress).
- Infraestructura de servidores y configuración de red.
- Servicios de terceros no mockeables (ej. pasarelas de pago externas en producción).
- Bases de datos en entorno productivo.

### 2.3 Ambientes de Ejecución

| Ambiente | Propósito | Responsable |
|----------|-----------|-------------|
| **Local (dev)** | Ejecución durante desarrollo. Tests unitarios en tiempo real. | Desarrolladores |
| **CI/CD (staging)** | Ejecución automática en cada pull request y merge. Suite completa. | DevOps / QA |
| **Pre-producción** | Smoke tests y validaciones finales antes del release. | QA Senior |

> ⚠️ Las pruebas automatizadas con Jest **nunca** se ejecutan directamente sobre el ambiente productivo.

---

## 3. Funcionalidades a Probar

### 3.1 Funcionalidades Críticas

#### 3.1.1 Autenticación y Seguridad
- Registro de nuevos usuarios con validación de campos.
- Login con credenciales válidas e inválidas.
- Generación y validación de tokens JWT.
- Cierre de sesión y revocación de tokens.
- Control de acceso por roles (RBAC).

#### 3.1.2 Gestión de Usuarios
- Creación de usuario con datos completos y parciales.
- Lectura de perfil de usuario (propio y por ID).
- Actualización de datos de perfil.
- Eliminación (soft delete / hard delete según regla de negocio).
- Búsqueda y filtrado de usuarios.

#### 3.1.3 Módulo de Negocio Principal
- Creación y persistencia de entidades del dominio.
- Reglas de negocio y validaciones específicas.
- Cálculos y transformaciones de datos.
- Flujos de estado (state machine) si aplica.

#### 3.1.4 Capa de API / Servicios
- Respuestas correctas con status HTTP apropiados (200, 201, 400, 401, 403, 404, 500).
- Serialización y deserialización de payloads JSON.
- Manejo de headers y middleware.
- Rate limiting y throttling (si aplica).

### 3.2 Casos de Uso Principales a Validar

```
CU-001: Usuario se registra exitosamente con email y contraseña válidos.
CU-002: Usuario intenta registrarse con email ya existente → recibe error 409.
CU-003: Usuario inicia sesión y recibe token JWT válido.
CU-004: Usuario accede a recurso protegido con token expirado → error 401.
CU-005: Administrador elimina un usuario → el usuario no puede autenticarse.
CU-006: Sistema procesa correctamente una transacción del dominio.
CU-007: Sistema rechaza entrada con datos inválidos y retorna mensajes de error claros.
```

### 3.3 Validaciones Esperadas del Sistema

- **Campos obligatorios:** El sistema debe rechazar requests con campos requeridos vacíos o nulos.
- **Formato de datos:** Emails, fechas, números de teléfono y otros campos deben cumplir formatos definidos.
- **Longitud de strings:** Validar mínimos y máximos establecidos en el schema.
- **Tipos de datos:** El sistema no debe aceptar strings donde se espera número, o viceversa.
- **Unicidad:** Entidades con restricción de unicidad deben producir error descriptivo al duplicar.

### 3.4 Manejo de Errores

| Escenario de Error | Comportamiento Esperado |
|-------------------|------------------------|
| Datos de entrada inválidos | HTTP 400 + mensaje descriptivo en body |
| Recurso no encontrado | HTTP 404 + identificador del recurso |
| Sin autorización | HTTP 401 + instrucción de re-autenticación |
| Acceso denegado | HTTP 403 + motivo del rechazo |
| Error interno del servidor | HTTP 500 + código de error (sin stack trace en prod) |
| Timeout de servicio externo | Error controlado + retry logic si aplica |

---

## 4. Estrategia de Pruebas con Jest

### 4.1 Tipos de Pruebas Implementadas

#### 4.1.1 Pruebas Unitarias

Validan unidades de código de forma **aislada**, sin dependencias externas. Son la base de la pirámide de testing.

**Alcance:** Funciones puras, clases de servicio, helpers, validadores, transformadores de datos.

```javascript
// Ejemplo: Prueba unitaria de una función de validación
// src/utils/__tests__/validators.test.js

import { isValidEmail, isStrongPassword } from '../validators';

describe('Validators - Email', () => {
  test('debe retornar true para un email válido', () => {
    expect(isValidEmail('usuario@example.com')).toBe(true);
  });

  test('debe retornar false para un email sin dominio', () => {
    expect(isValidEmail('usuario@')).toBe(false);
  });

  test('debe retornar false para un string vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('Validators - Password', () => {
  test('debe aceptar contraseña con mayúscula, número y símbolo', () => {
    expect(isStrongPassword('Segura123!')).toBe(true);
  });

  test('debe rechazar contraseña de menos de 8 caracteres', () => {
    expect(isStrongPassword('Ab1!')).toBe(false);
  });
});
```

#### 4.1.2 Pruebas de Integración

Validan la **interacción entre módulos**, incluyendo la base de datos, servicios internos y capas de la aplicación.

```javascript
// Ejemplo: Prueba de integración del servicio de usuarios
// src/services/__tests__/userService.integration.test.js

import { UserService } from '../userService';
import { db } from '../../database/connection';

describe('UserService - Integración', () => {
  beforeAll(async () => {
    await db.connect();
    await db.migrate();
  });

  afterAll(async () => {
    await db.rollback();
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.seed('users');
  });

  afterEach(async () => {
    await db.clean('users');
  });

  test('debe crear un usuario y persistirlo en la base de datos', async () => {
    const newUser = { name: 'Ana García', email: 'ana@test.com', password: 'Segura123!' };
    const created = await UserService.create(newUser);

    expect(created).toMatchObject({
      id: expect.any(String),
      name: 'Ana García',
      email: 'ana@test.com',
    });

    const found = await UserService.findById(created.id);
    expect(found).not.toBeNull();
  });

  test('debe lanzar error al crear usuario con email duplicado', async () => {
    const existing = { name: 'Juan', email: 'existente@test.com', password: 'Segura123!' };
    await UserService.create(existing);

    await expect(UserService.create(existing)).rejects.toThrow('Email ya registrado');
  });
});
```

#### 4.1.3 Pruebas con Mocks y Stubs

Permiten **aislar dependencias externas** (APIs de terceros, servicios de email, base de datos) para pruebas controladas y predecibles.

```javascript
// Ejemplo: Mock de servicio de email externo
// src/services/__tests__/authService.test.js

import { AuthService } from '../authService';
import { EmailService } from '../emailService';
import { UserRepository } from '../../repositories/userRepository';

// Mock de módulos externos
jest.mock('../emailService');
jest.mock('../../repositories/userRepository');

describe('AuthService - Registro con Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe registrar usuario y enviar email de bienvenida', async () => {
    // Arrange
    const mockUser = { id: 'uuid-123', email: 'nuevo@test.com', name: 'Carlos' };
    UserRepository.create.mockResolvedValue(mockUser);
    EmailService.sendWelcome.mockResolvedValue({ success: true });

    // Act
    const result = await AuthService.register({
      email: 'nuevo@test.com',
      name: 'Carlos',
      password: 'Segura123!',
    });

    // Assert
    expect(UserRepository.create).toHaveBeenCalledTimes(1);
    expect(EmailService.sendWelcome).toHaveBeenCalledWith('nuevo@test.com', 'Carlos');
    expect(result.user).toMatchObject({ email: 'nuevo@test.com' });
  });

  test('debe lanzar error si el repositorio falla', async () => {
    UserRepository.create.mockRejectedValue(new Error('DB connection failed'));

    await expect(
      AuthService.register({ email: 'test@test.com', name: 'Test', password: 'Abc123!' })
    ).rejects.toThrow('DB connection failed');

    expect(EmailService.sendWelcome).not.toHaveBeenCalled();
  });
});
```

#### 4.1.4 Pruebas de Snapshot (Componentes / Respuestas)

Útiles para validar que la estructura de respuestas o componentes no cambia de forma inesperada.

```javascript
// Ejemplo: Snapshot de respuesta de API
test('la respuesta de perfil de usuario debe coincidir con el snapshot', () => {
  const userProfile = UserSerializer.toPublic({
    id: 'abc-123',
    name: 'María López',
    email: 'maria@test.com',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    passwordHash: 'SECRET_HASH', // debe ser omitido
  });

  expect(userProfile).toMatchSnapshot();
});
```

### 4.2 Convenciones de Jest

#### Estructura de Bloques

```javascript
describe('NombreDelModulo - Contexto o funcionalidad', () => {

  // Setup global del bloque
  beforeAll(() => { /* setup costoso una sola vez */ });
  afterAll(() => { /* teardown global */ });

  // Setup por prueba
  beforeEach(() => { /* inicializar estado limpio */ });
  afterEach(() => { /* limpiar mocks, spies, etc. */ });

  describe('cuando las condiciones son X', () => {
    test('debe hacer Y cuando Z', () => {
      // Arrange - preparar datos y mocks
      // Act - ejecutar la función/método
      // Assert - verificar el resultado
    });
  });
});
```

#### Matchers más Utilizados

```javascript
// Igualdad
expect(value).toBe(42);                        // Referencia estricta (===)
expect(object).toEqual({ name: 'Test' });      // Igualdad profunda
expect(obj).toMatchObject({ id: expect.any(String) }); // Coincidencia parcial

// Verdad / Falsedad
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Números
expect(num).toBeGreaterThan(0);
expect(num).toBeLessThanOrEqual(100);

// Strings
expect(str).toContain('palabra');
expect(str).toMatch(/^[a-z]+$/);

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain('elemento');

// Errores y Promesas
expect(fn).toThrow('mensaje de error');
await expect(asyncFn()).rejects.toThrow(Error);
await expect(asyncFn()).resolves.toEqual({ success: true });

// Mocks
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', expect.any(Number));
expect(mockFn).not.toHaveBeenCalled();
```

---

## 5. Estructura del Proyecto de Testing

### 5.1 Estructura de Carpetas Recomendada

```
src/
├── modules/
│   ├── auth/
│   │   ├── authController.js
│   │   ├── authService.js
│   │   └── __tests__/
│   │       ├── authController.test.js
│   │       ├── authService.test.js
│   │       └── authService.integration.test.js
│   └── users/
│       ├── userController.js
│       ├── userService.js
│       ├── userRepository.js
│       └── __tests__/
│           ├── userController.test.js
│           ├── userService.test.js
│           └── userRepository.integration.test.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── __tests__/
│       ├── validators.test.js
│       └── formatters.test.js
├── middlewares/
│   ├── authMiddleware.js
│   └── __tests__/
│       └── authMiddleware.test.js
└── __mocks__/
    ├── emailService.js
    ├── paymentGateway.js
    └── database.js

tests/
├── integration/
│   ├── auth.integration.test.js
│   └── users.integration.test.js
├── setup/
│   ├── globalSetup.js
│   ├── globalTeardown.js
│   └── jest.setup.js
└── fixtures/
    ├── users.fixture.js
    └── tokens.fixture.js
```

### 5.2 Convención de Nombres de Archivos

| Tipo de prueba | Convención | Ejemplo |
|---------------|-----------|---------|
| Unitaria | `[nombre].test.js` | `userService.test.js` |
| Integración | `[nombre].integration.test.js` | `authService.integration.test.js` |
| E2E (referencia) | `[nombre].e2e.test.js` | `loginFlow.e2e.test.js` |
| Mock manual | `__mocks__/[nombre].js` | `__mocks__/emailService.js` |
| Fixture de datos | `[nombre].fixture.js` | `users.fixture.js` |

### 5.3 Configuración de Jest (`jest.config.js`)

```javascript
// jest.config.js
module.exports = {
  // Entorno de ejecución
  testEnvironment: 'node',

  // Patrones de archivos de prueba
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/tests/**/*.test.js',
    '**/tests/**/*.integration.test.js',
  ],

  // Excluir de la búsqueda de pruebas
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '*.e2e.test.js', // E2E se corre por separado
  ],

  // Setup global antes de cada suite
  setupFilesAfterFramework: ['./tests/setup/jest.setup.js'],

  // Setup / teardown global (una vez por run)
  globalSetup: './tests/setup/globalSetup.js',
  globalTeardown: './tests/setup/globalTeardown.js',

  // Cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
    '!src/**/*.mock.js',
    '!src/index.js', // Entry point, sin lógica de negocio
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],

  // Timeout por defecto para pruebas asíncronas
  testTimeout: 10000,

  // Limpiar mocks automáticamente entre pruebas
  clearMocks: true,
  restoreMocks: true,

  // Mostrar cada prueba individualmente
  verbose: true,
};
```

### 5.4 Scripts de Ejecución (`package.json`)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern='__tests__/.*\\.test\\.js$'",
    "test:integration": "jest --testPathPattern='\\.integration\\.test\\.js$'",
    "test:ci": "jest --ci --coverage --forceExit",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

---

## 6. Criterios de Aceptación y Cobertura

### 6.1 Umbrales de Cobertura Mínima

| Métrica | Umbral mínimo | Objetivo ideal |
|---------|--------------|----------------|
| Statements | 80% | 90% |
| Branches | 80% | 85% |
| Functions | 80% | 90% |
| Lines | 80% | 90% |

> Las pruebas fallarán en el pipeline de CI/CD si no se cumplen los umbrales mínimos definidos.

### 6.2 Criterios de Aprobación de Pruebas

Una release se considera lista para producción cuando:

- ✅ El 100% de las pruebas unitarias pasan en el ambiente de CI.
- ✅ El 100% de las pruebas de integración pasan en staging.
- ✅ La cobertura de código supera los umbrales definidos.
- ✅ No existen pruebas marcadas como `.skip` o `.todo` en módulos críticos.
- ✅ Todos los defectos de severidad Alta y Crítica están resueltos.

### 6.3 Severidad de Defectos

| Nivel | Descripción | Acción requerida |
|-------|-------------|-----------------|
| **Crítico** | Sistema inoperable, pérdida de datos | Bloquea el release inmediatamente |
| **Alto** | Funcionalidad principal rota, sin workaround | Debe resolverse antes del release |
| **Medio** | Funcionalidad degradada, existe workaround | Debe resolverse en el sprint actual |
| **Bajo** | Problema cosmético o menor | Puede diferirse al siguiente sprint |

---

## 7. Entorno de Ejecución

### 7.1 Requisitos Técnicos

| Herramienta | Versión mínima | Notas |
|------------|---------------|-------|
| Node.js | >= 18.x LTS | Requerido por Jest 29+ |
| npm / yarn | npm >= 9.x | Gestión de dependencias |
| Jest | >= 29.x | Framework de testing principal |
| @jest/globals | Misma que Jest | Para tipos en TypeScript (si aplica) |

### 7.2 Variables de Entorno para Testing

```bash
# .env.test
NODE_ENV=test
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp_test
JWT_SECRET=test-secret-key-only-for-testing
EMAIL_SERVICE_ENABLED=false
EXTERNAL_API_URL=http://localhost:3001/mock
```

### 7.3 Pipeline de CI/CD (Referencia)

```yaml
# Ejemplo: GitHub Actions
- name: Run Tests
  run: npm run test:ci
  env:
    NODE_ENV: test
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

---

## 8. Roles y Responsabilidades

| Rol | Responsabilidad |
|-----|----------------|
| **QA** | Definir estrategia, revisar plan, aprobar releases, escribir y mantener pruebas de integración, reportar defectos |
| **BACKEND** |  |Validar usuarios al iniciar sesión, calcular totales de compras, aplicar reglas de negocio, procesar pagos, gestionar permisos|
| **FRONTEND** |Construir la interfaz visual, hacer la web interactiva, conectarse con el backend (APIs), adaptar la web a distintos dispositivos, optimizar la experiencia del usuario (UX) |
| **SCRUM MASTER** | Facilitar las ceremonias de Scrum, eliminar bloqueos del equipo, Proteger al equipo, medir el progreso del equipo|

---

## 9. Gestión de Defectos

### 9.1 Ciclo de Vida de un Defecto

```
Detectado → Reportado → Asignado → En desarrollo → En revisión → Verificado → Cerrado
                                                                      ↓
                                                                  Reabierto (si falla)
```

### 9.2 Información Requerida en Reporte de Defecto

```markdown
**ID:** DEF-001
**Título:** [Descripción corta del defecto]
**Módulo:** [Módulo afectado]
**Severidad:** [Crítico / Alto / Medio / Bajo]
**Prioridad:** [Alta / Media / Baja]
**Ambiente:** [Local / CI / Staging]
**Pasos para reproducir:**
  1. ...
  2. ...
**Resultado esperado:** ...
**Resultado obtenido:** ...
**Prueba fallida:** [Nombre del test / archivo]
**Evidencia:** [Log de error / screenshot]
```

---

## 10. Entregables

### 10.1 Documentos

- [x] Plan de Pruebas (este documento)
- [ ] Reporte de Ejecución de Pruebas (por sprint/release)
- [ ] Reporte de Cobertura de Código (generado automáticamente por Jest)
- [ ] Registro de Defectos (en herramienta de gestión: Jira / Linear / GitHub Issues)

### 10.2 Artefactos Técnicos

- [ ] Suite de pruebas unitarias implementadas
- [ ] Suite de pruebas de integración implementadas
- [ ] Configuración de Jest (`jest.config.js`) validada en CI
- [ ] Mocks y fixtures reutilizables en `tests/` y `__mocks__/`
- [ ] Configuración del pipeline de CI con reporte de cobertura

### 10.3 Cronograma de Actividades

| Actividad | Responsable | Sprint | Estado |
|-----------|-------------|--------|--------|
| Definir y aprobar este plan | QA  | Sprint 1 | 🔄 En progreso |
| Configurar Jest y estructura de carpetas | Sprint 1 | ⬜ Pendiente |
| Implementar pruebas unitarias (módulos core) | Sprint 1-2 | ⬜ Pendiente |
| Implementar pruebas de integración | ⬜ Pendiente |
| Integrar cobertura en CI/CD | DevOps | Sprint 2 | ⬜ Pendiente |
| Revisión y ajuste de cobertura | QA | Sprint 3 | ⬜ Pendiente |
| Sign-off final y documentación | QA  | Sprint 3 | ⬜ Pendiente |

---

## Historial de Cambios

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0.0 | 2026-04-29 | QA Team | Versión inicial del documento |

---

*Este documento es un artefacto vivo. Debe actualizarse al inicio de cada release mayor o cuando cambien los requisitos del sistema.*
