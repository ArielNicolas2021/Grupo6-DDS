# Spring Boot Base Project

Estructura base del proyecto backend con arquitectura en capas.

## Stack Tecnológico

| Tecnología      | Versión  |
|-----------------|----------|
| Java            | 17       |
| Spring Boot     | 3.2.4    |
| Maven           | 3.x      |
| H2 Database     | In-memory|
| Lombok          | Incluido |

---

## Estructura del Proyecto

```
src/
└── main/
│   ├── java/com/example/app/
│   │   ├── AppApplication.java         ← Clase principal (@SpringBootApplication)
│   │   ├── controllers/
│   │   │   └── ProductController.java  ← Capa Controller (REST endpoints)
│   │   ├── services/
│   │   │   └── ProductService.java     ← Capa Service (lógica de negocio)
│   │   ├── repositories/
│   │   │   └── ProductRepository.java  ← Capa Repository (acceso a datos)
│   │   └── models/
│   │       └── Product.java            ← Capa Model (entidades JPA)
│   └── resources/
│       └── application.properties      ← Configuración
└── test/
    └── java/com/example/app/
        └── AppApplicationTests.java    ← Test de contexto
```

---

## Arquitectura en Capas

```
HTTP Request
     │
     ▼
┌──────────────┐
│  Controller  │  ← Recibe peticiones HTTP, valida entrada, devuelve respuestas
└──────┬───────┘
       │ delega lógica de negocio
       ▼
┌──────────────┐
│   Service    │  ← Contiene la lógica de negocio, orquesta operaciones
└──────┬───────┘
       │ accede a datos
       ▼
┌──────────────┐
│  Repository  │  ← Abstrae el acceso a la base de datos (Spring Data JPA)
└──────┬───────┘
       │ mapea a
       ▼
┌──────────────┐
│    Model     │  ← Entidades JPA que representan las tablas de la BD
└──────────────┘
```

---

## Comandos para Ejecutar

### Prerrequisitos
- Java 17+ instalado
- Maven 3.x instalado (o usar `./mvnw`)

### Compilar el proyecto
```bash
mvn clean compile
```

### Ejecutar tests
```bash
mvn test
```

### Levantar el servidor
```bash
mvn spring-boot:run
```

### Compilar y empaquetar (genera .jar)
```bash
mvn clean package
java -jar target/app-0.0.1-SNAPSHOT.jar
```

---

## Endpoints Disponibles

| Método | Endpoint           | Descripción                          |
|--------|--------------------|--------------------------------------|
| GET    | /api/health        | ✅ Verifica que el servidor funciona  |
| GET    | /api/products      | Lista todos los productos             |
| GET    | /api/products/{id} | Obtiene un producto por ID            |
| POST   | /api/products      | Crea un nuevo producto                |
| DELETE | /api/products/{id} | Elimina un producto                   |

### Probar el endpoint de salud
```bash
curl http://localhost:8080/api/health
```

Respuesta esperada:
```json
{
  "status": "UP",
  "message": "El servidor está funcionando correctamente"
}
```

### Crear un producto (ejemplo)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "Laptop gaming", "price": 1500.00}'
```

---

## Consola H2 (Base de Datos en Memoria)

Acceder en: http://localhost:8080/h2-console

| Campo    | Valor              |
|----------|--------------------|
| JDBC URL | jdbc:h2:mem:testdb |
| Username | sa                 |
| Password | (vacío)            |
