# MiniBlog API

API REST desarrollada en Node.js + Express conectada a PostgreSQL para gestionar autores y posts.

---

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- swagger-ui-express
- yaml
- Vitest + Supertest

---

## Requisitos previos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Git instalado

---

## Estructura del proyecto

```text
miniblog-api/
├── .env.example
├── index.js
├── openapi.yaml
├── package.json
├── README.md
├── vitest.config.js
├── sql/
│   ├── setup.sql
│   └── seed.sql
├── src/
│   ├── app.js
│   ├── db/
│   │   └── pool.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── errors.js
│   ├── routes/
│   │   ├── authors.routes.js
│   │   └── posts.routes.js
│   └── services/
│       ├── authors.service.js
│       └── posts.service.js
└── tests/
	├── integration/
	│   ├── authors.test.js
	│   └── posts.test.js
	└── unit/
		├── authors.service.test.js
		└── posts.service.test.js
```

---

## Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/miniblog-api.git
cd miniblog-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá con tus datos:

```bash
cp .env.example .env
```

El archivo `.env` debe tener este formato:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@127.0.0.1:5432/miniblog
```

La aplicación toma la cadena de conexión desde `DATABASE_URL` en `src/db/pool.js`.

### 4. Crear la base de datos y las tablas

Conectate a PostgreSQL y ejecutá:

```bash
psql -U postgres -h 127.0.0.1
```

Luego dentro de psql:

```sql
CREATE DATABASE miniblog;
\c miniblog postgres 127.0.0.1
\i sql/setup.sql
\i sql/seed.sql
```

### 5. Iniciar el servidor

En la consola, ejecutá `npm run dev` o `npm start` para iniciar el servidor.

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## Cómo ejecutar los tests

En la consola, ejecutá `npm test`

```bash
npm test
```

---

## Documentación OpenAPI / Swagger

El archivo `openapi.yaml` en la raíz del proyecto contiene la especificación completa de la API en formato OpenAPI 3.0.

La documentación interactiva está disponible en:

- Desarrollo: `http://localhost:3000/docs`
- Producción: `https://proyectom2gerardo-acosta-production.up.railway.app/docs`

Para verla en local, habiendo iniciado el servidor, abrí la URL de "Desarrollo".

Para verla en "Producción", abrí la URL pública de Railway.

Opcionalmente, también podés abrir el archivo en [Swagger Editor](https://editor.swagger.io) pegando el contenido de `openapi.yaml`.

---

## Endpoints disponibles

### Authors

| Método | Ruta           | Descripción              |
| ------ | -------------- | ------------------------ |
| GET    | `/authors`     | Listar todos los autores |
| GET    | `/authors/:id` | Detalle de un autor      |
| POST   | `/authors`     | Crear autor              |
| PUT    | `/authors/:id` | Actualizar autor         |
| DELETE | `/authors/:id` | Eliminar autor           |

### Posts

| Método | Ruta                      | Descripción                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/posts`                  | Listar todos los posts           |
| GET    | `/posts/:id`              | Detalle de un post               |
| GET    | `/posts/author/:authorId` | Posts de un autor con su detalle |
| POST   | `/posts`                  | Crear post                       |
| PUT    | `/posts/:id`              | Actualizar post                  |
| DELETE | `/posts/:id`              | Eliminar post                    |

---

## Validaciones y manejo de errores

La API aplica validaciones en rutas antes de ejecutar operaciones de base de datos, y centraliza el manejo de errores en middlewares.

### Validaciones en Authors

- `id` debe ser un número entero positivo en rutas con parámetro (`/authors/:id`).
- `name` y `email` son obligatorios en `POST /authors` y `PUT /authors/:id`.
- `email` es único: si ya existe, la API responde conflicto.

### Validaciones en Posts

- `id` y `authorId` deben ser números enteros positivos (`/posts/:id`, `/posts/author/:authorId`).
- `title`, `content` y `author_id` son obligatorios en `POST /posts` y `PUT /posts/:id`.
- `author_id` debe ser entero positivo.
- Si `author_id` no existe en la tabla de autores (FK), la API responde error de entidad no procesable.

### Códigos de estado usados

- `200 OK`: consulta o actualización exitosa.
- `201 Created`: recurso creado correctamente.
- `204 No Content`: recurso eliminado correctamente.
- `400 Bad Request`: datos faltantes o formato inválido (por ejemplo IDs inválidos).
- `404 Not Found`: autor o post no encontrado.
- `409 Conflict`: conflicto de unicidad (email de autor repetido).
- `422 Unprocessable Entity`: referencia inválida de clave foránea (`author_id` inexistente).
- `500 Internal Server Error`: error inesperado en el servidor.

### Formato de respuesta de error

Los errores se normalizan en el middleware global y responden en formato JSON:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

---

## Deploy en Railway

### 1. Subir el proyecto a GitHub

Creá un repositorio en GitHub y subí tu proyecto para poder conectarlo desde Railway.

### 2. Crear cuenta en Railway

Registrate en [railway.app](https://railway.app) y creá un nuevo proyecto.

### 3. Conectar el repositorio

En Railway, seleccioná **Deploy from GitHub** y conectá tu repositorio. Railway usará el script `start` del `package.json` para levantar la API.

### 4. Agregar servicio PostgreSQL

Dentro del proyecto en Railway, agregá un servicio de PostgreSQL. Railway te proveerá automáticamente las credenciales de conexión.

### 5. Configurar variables de entorno

En Railway, en la sección **Variables** del servicio web (la API), configurá:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/miniblog
PORT=3000
```

En este proyecto, la app consume `process.env.DATABASE_URL`, así que ese valor debe apuntar al servicio de Postgres de Railway.

Si Railway te ofrece ambas opciones, preferí `Postgres.DATABASE_URL` (conexión interna). Usá `Postgres.DATABASE_PUBLIC_URL` solo si necesitás conexión pública por un motivo específico.

### 6. Ejecutar los scripts SQL

Desde la consola de PostgreSQL en Railway (o con un cliente externo), ejecutá:

- `sql/setup.sql` para crear tablas e índice.
- `sql/seed.sql` (opcional) para cargar datos de prueba.

### 7. Verificar despliegue

Probá la URL pública de Railway y verificá que estos endpoints respondan:

- `/`
- `/authors`
- `/posts`
- `/docs`

La documentación Swagger queda disponible en `https://<tu-dominio-de-railway>/docs`.

---

## Registro de uso de IA

Durante el desarrollo de este proyecto utilicé Claude (Anthropic) como asistente.

### Partes con asistencia de IA

| Área                     | Descripción del uso                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Estructura del proyecto  | Se consultó la organización de carpetas y archivos para mantener la separación de responsabilidades (routes, services, middlewares) |
| Configuración de pg.Pool | Se consultó el setup con soporte para `DATABASE_URL` y variables de entorno separadas                                               |
| Middleware de errores    | Se solicitó un ejemplo de middleware centralizado para normalizar respuestas de error con códigos HTTP semánticos                   |
| Queries SQL              | Se revisó la sintaxis de queries parametrizadas con `$1`, `$2` en node-postgres para prevenir SQL injection                         |
| Tests con Vitest         | Se consultó cómo organizar tests unitarios e integración y resolver mocking con módulos CommonJS                                    |
| OpenAPI                  | Se generó la estructura base del archivo `openapi.yaml` con endpoints y esquemas                                                    |
| Swagger UI               | Se consultó cómo integrar swagger-ui-express para servir documentación interactiva en `/docs`                                       |
| README                   | Se generó la documentación inicial del proyecto                                                                                     |

### Partes desarrolladas de forma autónoma

- Comprensión y revisión de cada archivo antes de implementarlo
- Decisiones de estructura y nombres de archivos
- Resolución de errores con mocking en tests (ESM vs CommonJS)
- Configuración del entorno local (PostgreSQL, variables de entorno)
- Adaptación de queries y servicios a la lógica de negocio específica
- Diseño de validaciones en rutas según reglas de negocio
- Prueba manual de endpoints antes de integrar cambios

### Nota de validación

La IA fue utilizada como guía y punto de partida. Cada parte del código fue comprendido, revisado y probado manualmente antes de ser integrado al proyecto. Se realizaron ajustes para garantizar que cumpliera con los requisitos planteados.
