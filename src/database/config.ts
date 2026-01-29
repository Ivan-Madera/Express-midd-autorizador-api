import { Sequelize } from 'sequelize'
import env from '../config/callEnv'
import { LogError, LogInfo, LogMark } from '../utils/logger'

const dbPort = env.DB_PORT
const MAX_CONNECTION = env.MAX_CONNECTION
const MIN_CONNECTION = env.MIN_CONNECTION
const DB_ACQUIRE = env.DB_ACQUIRE
const DB_IDLE = env.DB_IDLE
const DB_EVICT = env.DB_EVICT

LogMark(
  `MIN_CONNECTION: ${MIN_CONNECTION} | MAX_CONNECTION: ${MAX_CONNECTION} | ACQUIRE: ${DB_ACQUIRE} | IDLE: ${DB_IDLE} | DB_EVICT: ${DB_EVICT}`
)

const rds =
  env.ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}

class Database {
  public sequelize: Sequelize

  constructor() {
    this.sequelize = new Sequelize(
      env.DB_DATABASE,
      env.DB_USERNAME,
      env.DB_PASSWORD,
      {
        host: env.DB_HOST,
        port: dbPort,
        logging: console.log,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        dialectOptions: rds,
        pool: {
          max: MAX_CONNECTION,
          min: MIN_CONNECTION,
          acquire: DB_ACQUIRE,
          idle: DB_IDLE,
          evict: DB_EVICT
        },
        define: {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          timestamps: true
        }
      }
    )
  }

  getSequelize(): Sequelize {
    return this.sequelize
  }

  async getConection(): Promise<void> {
    await this.sequelize.authenticate()
  }
}

const db = new Database()
db.getConection()
  .then(() => {
    LogInfo('Conexion exitosa')
  })
  .catch((error: any) => {
    LogError(`Conexion fallida: ${error.message as string}`)
  })

export const sequelize = db.getSequelize()
