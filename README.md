# 🚀 EXPRESS-JSONAPI-TEMPLATE

Esta API está diseñada para ser utilizada por desarrolladores que requieran un template robusto y escalable para crear APIs REST siguiendo el estándar JSON:API. Proporciona una estructura completa con autenticación JWT, documentación Swagger automática, testing integrado y configuración para desarrollo y producción.

## 📋 Tabla de Contenidos

- [🎯 Descripción](#-descripción)
- [🛠️ Tecnologías](#-tecnologías)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🐳 Docker](#-docker)
- [☁️ Despliegue](#-despliegue)
- [🧪 Scripts Disponibles](#-scripts-disponibles)
- [🔧 Variables de Entorno](#-variables-de-entorno)
- [📡 API Endpoints](#-api-endpoints)
- [📝 Licencia](#-licencia)
- [📞 Soporte](#-soporte)

## 🎯 Descripción

Este template actúa como base sólida para el desarrollo de APIs REST, proporcionando una estructura completa que permite:

- Crear APIs siguiendo el estándar JSON:API
- Implementar autenticación JWT segura
- Generar documentación automática con Swagger
- Manejar errores y respuestas estandarizadas
- Ejecutar pruebas automatizadas con Jest
- Gestionar base de datos con migraciones y seeders
- Desplegar en contenedores Docker

## 🛠️ Tecnologías

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime de JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript con tipado estático

### Base de Datos
- **[MySQL](https://www.mysql.com/)** - Sistema de gestión de base de datos
- **[Sequelize](https://sequelize.org/)** - ORM para Node.js

### Seguridad y Validación
- **[Helmet](https://helmetjs.github.io/)** - Middleware de seguridad
- **[JWT](https://jwt.io/)** - Autenticación por tokens
- **[Joi](https://joi.dev/)** - Validación de esquemas
- **[Express Validator](https://express-validator.github.io/)** - Validación de datos

### Documentación y Testing
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentación de API
- **[Jest](https://jestjs.io/)** - Framework de testing
- **[Supertest](https://github.com/visionmedia/supertest)** - Testing de endpoints

### Despliegue y DevOps
- **[Docker](https://www.docker.com/)** - Containerización
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestación de contenedores

### Utilidades
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Log4js](https://log4js-node.github.io/)** - Logging
- **[UUID](https://github.com/uuidjs/uuid)** - Generación de IDs únicos

## 📁 Estructura del Proyecto

```
express-jsonapi-template/
├── src/
│   ├── config/         # Configuraciones de la aplicación
│   ├── controllers/    # Controladores de la API
│   ├── database/       # Configuración de base de datos
│   ├── entities/       # Entidades de respuesta
│   ├── errors/         # Manejo de errores personalizados
│   ├── middlewares/    # Middlewares de Express
│   ├── repositories/   # Capa de acceso a datos
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── tests/          # Pruebas unitarias e integración
│   ├── utils/          # Utilidades y helpers
│   └── validators/     # Validaciones de entrada
├── app.ts              # Punto de entrada de la aplicación
├── Dockerfile          # Configuración de Docker
├── docker-compose.yaml # Orquestación de contenedores
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── jest.config.ts      # Configuración de Jest
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior
- MySQL 8.0 o superior
- Git

### Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Ivan-Madera/Express-jsonapi-template.git
   cd Express-jsonapi-template
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus valores
   ```

4. **Configura la base de datos:**
   ```bash
   npm run migrate
   npm run seeder
   ```

5. **Compila el proyecto:**
   ```bash
   npm run build
   ```

6. **Ejecuta en modo desarrollo:**
   ```bash
   npm run dev
   ```

## 🐳 Docker

### Construir la imagen

```bash
docker build -t express-jsonapi-template .
```

### Ejecutar con Docker

```bash
docker run -p 3000:3000 --env-file .env express-jsonapi-template
```

### Usar Docker Compose

```bash
docker-compose up -d
```

## ☁️ Despliegue

### Contenedores Docker

El proyecto está configurado para desplegarse en cualquier plataforma que soporte Docker:

```bash
# Construir imagen de producción
docker build -t express-jsonapi-template:prod .

# Ejecutar en producción
docker run -d -p 3000:3000 --env-file .env.prod express-jsonapi-template:prod
```

### Configuración de Producción

Para el despliegue en producción, asegúrate de:

- Configurar variables de entorno de producción
- Configurar base de datos de producción
- Configurar logs y monitoreo
- Configurar SSL/TLS si es necesario

## 🧪 Scripts Disponibles

| Comando                   | Descripción                               |
|---------------------------|-------------------------------------------|
| `npm run build`           | Compila TypeScript a JavaScript           |
| `npm start`               | Ejecuta la aplicación en producción       |
| `npm run dev`             | Ejecuta en modo desarrollo con hot-reload |
| `npm test`                | Ejecuta todas las pruebas                 |
| `npm run test:watch`      | Ejecuta pruebas en modo watch             |
| `npm run lint`            | Verifica el código con ESLint             |
| `npm run lint:fix`        | Corrige errores de ESLint automáticamente |
| `npm run format`          | Formatea el código con Prettier           |
| `npm run new:migration`   | Genera nueva migración                    |
| `npm run new:seeder`      | Genera nuevo seeder                       |
| `npm run migrate`         | Ejecuta migraciones pendientes            |
| `npm run seeder`          | Ejecuta seeders pendientes                |

## 🔧 Variables de Entorno

| Variable         | Descripción                                | Tipo      | Requerida |
|------------------|--------------------------------------------|-----------|-----------|
| `ENV`            | Entorno de ejecución                       | string    | ✅        |
| `PORT`           | Puerto del servidor                        | number    | ✅        |
| `DB_DATABASE`    | Nombre de la base de datos                 | string    | ✅        |
| `DB_USERNAME`    | Usuario de MySQL                           | string    | ✅        |
| `DB_PASSWORD`    | Contraseña de MySQL                        | string    | ✅        |
| `DB_HOST`        | Host de la base de datos                   | string    | ✅        |
| `DB_PORT`        | Puerto de MySQL                            | number    | ✅        |
| `TOKEN`          | Token secreto para autenticación           | string    | ✅        |
| `SECRET_KEY`     | Clave para firmar JWT                      | string    | ✅        |
| `MAX_CONNECTION` | Conexiones máximas simultáneas             | number    | ❌        |
| `MIN_CONNECTION` | Conexiones mínimas activas                 | number    | ❌        |
| `DB_ACQUIRE`     | Tiempo máximo para adquirir conexión (ms)  | number    | ❌        |
| `DB_IDLE`        | Tiempo máximo de inactividad (ms)          | number    | ❌        |
| `DB_EVICT`       | Intervalo de limpieza de conexiones (ms)   | number    | ❌        |

## 📡 API Endpoints

### Base URL
```
https://api.example.com/api/v1
```

### Autenticación
La mayoría de endpoints requieren un token Bearer en el header:
```
Authorization: Bearer <token>
```

### Endpoints Disponibles

#### [V1] Users

| Método | Ruta          | Descripción                   | Autenticación |
|--------|---------------|-------------------------------|---------------|
| POST   | /accesstoken  | Obtiene token JWT de acceso   | ❌            |
| POST   | /users/get    | Obtiene usuarios activos      | ✅            |
| POST   | /users        | Registra nuevo usuario        | ✅            |
| PATCH  | /users        | Actualiza usuario existente   | ✅            |

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al autor del template.

---

**Desarrollado con ❤️ por Ivan Madera**
