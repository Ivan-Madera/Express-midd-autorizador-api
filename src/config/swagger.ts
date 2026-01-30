import env from './callEnv'

export const options = {
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'Midd Autorizador API',
      version: '1.0.0',
      description: 'Middleware de autorización para validación de permisos y seguridad'
    },
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT'
    },
    servers: [
      {
        url: env.ENV === 'production' ? '' : `http://127.0.0.1:${env.PORT}`
      }
    ]
  },
  apis: ['./src/routes/**/*.*']
}

export const custom = {
  customSiteTitle: 'Midd Autorizador API',
  swaggerOptions: {
    persistAuthorization: true
  }
}
