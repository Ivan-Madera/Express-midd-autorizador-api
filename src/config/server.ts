import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { Diaries } from '../routes/diaries.routes'
import { Users } from '../routes/users.routes'
import { sequelize } from '../database/config'
import { LogInfo } from '../utils/logger'
import { baseRoute, headerNoCache } from '../middlewares/shared.middleware'
import { helmetContentSecurityPolicy, helmetTransportSecurity } from './helmet'
import { custom, options } from './swagger'
import env from './callEnv'

class Server {
  public app: Application
  readonly pathV1 = '/api/v1'

  constructor() {
    this.app = express()
    this.initialize()
  }

  private initialize(): void {
    this.configureSecurity()
    this.configureMiddlewares()
    this.configureSwagger()
    this.configureRoutes()
  }

  private configureSecurity(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: helmetContentSecurityPolicy,
        hsts: helmetTransportSecurity,
        frameguard: { action: 'deny' }
      })
    )
  }

  private configureMiddlewares(): void {
    this.app.use(cors())
    this.app.use(headerNoCache)
    this.app.use(express.json({ type: 'application/vnd.api+json' }))
    this.app.use(express.urlencoded({ extended: true }))
  }

  private configureSwagger(): void {
    if (env.ENV !== 'production') {
      this.app.use(
        '/docs',
        swaggerUI.serve,
        swaggerUI.setup(swaggerJSDoc(options), custom)
      )
    }
  }

  private configureRoutes(): void {
    this.app.use(this.pathV1, Diaries)
    this.app.use(this.pathV1, Users)
  }

  public listen(): void {
    this.app.get('/', baseRoute)

    this.app.listen(env.PORT, () => {
      const message =
        env.ENV === 'production'
          ? `Server running in ${env.ENV} environment`
          : `Server listening on http://127.0.0.1:${env.PORT}/docs`

      LogInfo(message)
    })
  }

  public getService(): Application {
    return this.app
  }

  public async close(): Promise<void> {
    await sequelize.close()
  }
}

export const server = new Server()
