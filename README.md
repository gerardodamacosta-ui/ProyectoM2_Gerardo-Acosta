# MiniBlog API

API REST desarrollada en Node.js + Express conectada a PostgreSQL para gestionar autores y posts.

---

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Vitest + Supertest

---

## Requisitos previos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Git instalado

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
PORT=3000
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@127.0.0.1:5432/miniblog

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

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## Cómo ejecutar los tests

```bash
npm test
```

---

## Documentación OpenAPI

El archivo `openapi.yaml` en la raíz del proyecto contiene la documentación completa de la API en formato OpenAPI 3.0.

Para visualizarla de forma interactiva podés usar [Swagger Editor](https://editor.swagger.io), pegando el contenido del archivo.

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

## Deploy en Railway

### 1. Crear cuenta en Railway

Registrate en [railway.app](https://railway.app) y creá un nuevo proyecto.

### 2. Agregar servicio PostgreSQL

Dentro del proyecto en Railway, agregá un servicio de PostgreSQL. Railway te proveerá automáticamente las credenciales de conexión.

### 3. Configurar variables de entorno

En Railway, en la sección **Variables** de tu servicio, agregá:
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/miniblog
PORT=3000

Usá la **Internal URL** que Railway genera para la base de datos como valor de `DATABASE_URL`.

### 4. Conectar el repositorio

En Railway, seleccioná **Deploy from GitHub** y conectá tu repositorio. Railway detectará automáticamente el script `start` del `package.json` y desplegará la app.

### 5. Ejecutar el script SQL en Railway

Desde la consola de Railway o usando un cliente PostgreSQL externo con la **Public URL**, ejecutá el contenido de `sql/setup.sql` para crear las tablas.

---

## Uso de IA en el proyecto

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) como herramienta de apoyo. La IA fue utilizada para:

- Generar y revisar código de servicios, rutas y middlewares
- Sugerir estructura de archivos y buenas prácticas
- Escribir tests con Vitest y Supertest
- Generar la documentación OpenAPI
- Redactar este README

Todos los prompts fueron revisados y el código generado fue comprendido y validado antes de ser incorporado al proyecto.
