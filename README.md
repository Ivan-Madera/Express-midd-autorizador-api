# Midd Autorizador API 🛡️

**Middle de Autorización para validación de permisos y seguridad.**

Este proyecto es una API REST construida con **Node.js, Express y TypeScript** diseñada para gestionar la autenticación y autorización de usuarios. Proporciona endpoints seguros para registro, inicio de sesión, gestión de sesiones y renovación de tokens, siguiendo la especificación **JSON:API**.

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Guía de Uso](#-guía-de-uso)
6. [API Endpoints](#-api-endpoints)
7. [Scripts Disponibles](#-scripts-disponibles)
8. [Estructura de Base de Datos](#-estructura-de-base-de-datos)
9. [Licencia](#-licencia)

---

## 🎯 Descripción General

### ¿Qué problema soluciona?

Provee un sistema centralizado y seguro para la gestión de identidades y control de acceso. Elimina la necesidad de reimplementar lógica de autenticación en diferentes servicios al centralizar el manejo de usuarios, sesiones y tokens JWT.

### Funcionalidades Principales

- **Registro de Usuarios**: Creación de nuevas cuentas con validación de datos.
- **Autenticación (Login)**: Verificación de credenciales y emisión de Access y Refresh Tokens.
- **Gestión de Sesiones**:
  - Renovación de tokens (`Refresh Token`).
  - Cierre de sesión (`Logout` server-side invalidation).
  - Revocación global de sesiones (`Logout All`).
- **Seguridad**: Headers HTTP seguros (Helmet), validación de esquemas (Joi/Express-Validator) y contraseñas hasheadas (Argon2).
- **Documentación**: Swagger UI integrado.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas modular y escalable:

```
src/
├── config/         # Configuración del servidor, Swagger, carga de entorno (env).
├── controllers/    # Manejadores de requests (lógica de entrada/salida).
├── database/       # Configuración de Sequelize, Modelos, Migraciones y Seeders.
│   └── models/     # Definición de esquemas (User, Session).
├── entities/       # Entidades de respuesta formateadas.
├── errors/         # Manejo centralizado de errores.
├── middlewares/    # Middlewares globales y de autenticación (JWT check, validaciones).
├── repositories/   # Capa de acceso a datos (interacción con DB).
├── routes/         # Definición de endpoints y rutas (Auth).
├── services/       # Lógica de negocio pura.
├── utils/          # Utilidades (Logger, respuestas JSON:API, códigos HTTP).
└── validators/     # Validaciones de request body/params.
```

### Componentes Clave

- **Server (`src/config/server.ts`)**: Clase principal que inicializa Express, middlewares y rutas.
- **Auth Routes (`src/routes/auth.routes.ts`)**: Define los endpoints de autenticación y sus validadores.
- **Authentication Middleware (`src/middlewares/authentication.middleware.ts`)**: Valida los tokens Bearer para rutas protegidas.

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (v5.x)
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework Web**: [Express](https://expressjs.com/)
- **Base de Datos**: MySQL con [Sequelize ORM](https://sequelize.org/)
- **Seguridad**:
  - [Helmet](https://helmetjs.github.io/): Seguridad en headers HTTP.
  - [Argon2](https://github.com/ranisalt/node-argon2): Hashing de contraseñas.
  - [JWT](https://jwt.io/): Tokens de acceso.
  - [Cors](https://github.com/expressjs/cors): Gestión de orígenes cruzados.
- **Validación**: `express-validator` y `joi`.
- **Documentación**: `swagger-jsdoc` y `swagger-ui-express`.
- **Logging**: `log4js`.
- **Testing**: `jest` y `supertest`.

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Pasos de Instalación

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**:
   Crea un archivo `.env` basado en `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Configura las variables críticas:

   ```env
   ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_DATABASE=nombre_db
   TOKEN=secreto_token_jwt
   SECRET_KEY=clave_secreta_app
   ```

3. **Base de Datos**:
   Ejecuta las migraciones para crear las tablas:
   ```bash
   npm run migrate
   ```
   (Opcional) Carga datos de prueba:
   ```bash
   npm run seeder
   ```

---

## 📖 Guía de Uso

### Iniciar en Desarrollo

```bash
npm run dev
```

El servidor iniciará (por defecto) en `http://127.0.0.1:3000`.

### Acceder a la Documentación

Visita `http://127.0.0.1:3000/docs` para ver la documentación interactiva de Swagger (solo en entorno que no sea producción).

### Verificar Estado

Haz una petición GET a la raíz para ver el estado del servicio:
`GET http://127.0.0.1:3000/`

Respuesta HTML esperada: **"Midd Autorizador API"**

---

## 📡 API Endpoints

Base URL: `/api/v1`

### Autenticación (`/auth`)

| Método | Endpoint         | Descripción                                      | Auth Requerida |
| ------ | ---------------- | ------------------------------------------------ | -------------- |
| POST   | `/login`         | Inicia sesión y devuelve Access/Refresh Tokens.  | ❌             |
| POST   | `/register`      | Registra un nuevo usuario.                       | ❌             |
| POST   | `/refresh_token` | Obtiene un nuevo Access Token usando el Refresh. | ✅ (Header\*)  |
| POST   | `/logout`        | Cierra la sesión actual (invalida token).        | ✅ (Bearer)    |
| POST   | `/logout_all`    | Cierra todas las sesiones del usuario.           | ✅ (Bearer)    |

_> Nota: El refresh token suele enviarse en el body, pero el endpoint puede requerir validación de estructura._

**Ejemplo de Payload (Login)**:

```json
{
  "data": {
    "type": "user",
    "attributes": {
      "email": "user@example.com",
      "password": "password123",
      "device_id": "device-001",
      "device_type": "web"
    }
  }
}
```

---

## 🧪 Scripts Disponibles

Comandos npm definidos en `package.json`:

- `npm run dev`: Inicia el servidor de desarrollo con recarga automática.
- `npm run build`: Compila el código TypeScript a JavaScript en `/build`.
- `npm start`: Inicia el servidor compilado (producción).
- `npm run migrate`: Ejecuta las migraciones de base de datos.
- `npm run migrate:undo`: Revierte la última migración.
- `npm run new:migration`: Genera un nuevo archivo de migración.
- `npm run test`: Ejecuta los tests unitarios con Jest.
- `npm run lint`: Ejecuta el linter (ESLint).

---

## 🗄️ Estructura de Base de Datos

El sistema utiliza principalmente dos modelos (basado en `src/database/models`):

1. **User**: Almacena la información de perfil y credenciales.
2. **Session**: Gestiona los tokens de refresco y el estado de las sesiones activas por dispositivo.

---

## � Licencia

Este proyecto está bajo la licencia **MIT**.

---

**Midd Autorizador API**
