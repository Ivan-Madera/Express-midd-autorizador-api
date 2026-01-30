import { Router } from 'express'
import {
  checkBearer,
  contentTypeValidator,
  methodValidator
} from '../middlewares/authentication.middleware'
import {
  login,
  logout,
  logoutAll,
  refreshToken,
  register
} from '../controllers/auth.controller'
import {
  loginValidator,
  logoutValidator,
  refreshTokenValidator,
  registerValidator
} from '../validators/auth.validators'

const router = Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags: ["[V1] Auth"]
 *     description: Inicia sesión y obtiene los tokens de acceso y refresco.
 *     requestBody:
 *       content:
 *         application/vnd.api+json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       password:
 *                         type: string
 *                       device_id:
 *                         type: string
 *                       device_type:
 *                         type: string
 *           example:
 *             data:
 *               type: user
 *               attributes:
 *                 email: user@example.com
 *                 password: yourpassword
 *                 device_id: device123
 *                 device_type: android
 *     responses:
 *       200:
 *         description: Request exitoso.
 *       400:
 *          description: Ocurrio un error durante el proceso.
 *       401:
 *          description: Usuario no autorizado.
 *       415:
 *         description: Tipo de medio no soportado.
 *       422:
 *         description: Contenido no procesable.
 *       500:
 *         description: Mensaje de error.
 */
router.post(
  '/login',
  [methodValidator, contentTypeValidator, ...loginValidator],
  login
)

/**
 * @swagger
 * /api/v1/refresh_token:
 *   post:
 *     tags: ["[V1] Auth"]
 *     security:
 *     - bearerAuth: []
 *     description: Genera un nuevo token de acceso utilizando un token de refresco válido.
 *     requestBody:
 *       content:
 *         application/vnd.api+json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       refresh_token:
 *                         type: string
 *           example:
 *             data:
 *               type: user
 *               attributes:
 *                 refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Request exitoso.
 *       400:
 *          description: Ocurrio un error durante el proceso.
 *       401:
 *          description: Usuario no autorizado.
 *       415:
 *         description: Tipo de medio no soportado.
 *       422:
 *         description: Contenido no procesable.
 *       500:
 *         description: Mensaje de error.
 */
router.post(
  '/refresh_token',
  [
    methodValidator,
    contentTypeValidator,
    checkBearer,
    ...refreshTokenValidator
  ],
  refreshToken
)

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     tags: ["[V1] Auth"]
 *     security:
 *     - bearerAuth: []
 *     description: Invalida la sesión actual del usuario.
 *     requestBody:
 *       content:
 *         application/vnd.api+json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       refresh_token:
 *                         type: string
 *           example:
 *             data:
 *               type: user
 *               attributes:
 *                 refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Request exitoso.
 *       400:
 *          description: Ocurrio un error durante el proceso.
 *       401:
 *          description: Usuario no autorizado.
 *       415:
 *         description: Tipo de medio no soportado.
 *       422:
 *         description: Contenido no procesable.
 *       500:
 *         description: Mensaje de error.
 */
router.post(
  '/logout',
  [methodValidator, contentTypeValidator, checkBearer, ...logoutValidator],
  logout
)

/**
 * @swagger
 * /api/v1/logout_all:
 *   post:
 *     tags: ["[V1] Auth"]
 *     security:
 *     - bearerAuth: []
 *     description: Invalida todas las sesiones activas del usuario.
 *     responses:
 *       200:
 *         description: Request exitoso.
 *       400:
 *          description: Ocurrio un error durante el proceso.
 *       401:
 *          description: Usuario no autorizado.
 *       415:
 *         description: Tipo de medio no soportado.
 *       422:
 *         description: Contenido no procesable.
 *       500:
 *         description: Mensaje de error.
 */
router.post('/logout_all', [methodValidator, checkBearer], logoutAll)

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags: ["[V1] Auth"]
 *     description: Registra un nuevo usuario en el sistema.
 *     requestBody:
 *       content:
 *         application/vnd.api+json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       password:
 *                         type: string
 *           example:
 *             data:
 *               type: user
 *               attributes:
 *                 email: newuser@example.com
 *                 password: newpassword123
 *     responses:
 *       200:
 *         description: Request exitoso.
 *       400:
 *          description: Ocurrio un error durante el proceso.
 *       401:
 *          description: Usuario no autorizado.
 *       415:
 *         description: Tipo de medio no soportado.
 *       422:
 *         description: Contenido no procesable.
 *       500:
 *         description: Mensaje de error.
 */
router.post(
  '/register',
  [methodValidator, contentTypeValidator, ...registerValidator],
  register
)

export { router as Auth }
