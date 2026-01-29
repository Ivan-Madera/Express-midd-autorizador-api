/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const DB_PORT = parseInt(process.env.DB_PORT)

module.exports = {
  database: `${process.env.DB_DATABASE}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  port: DB_PORT,
  migrationStorageTableName: 'migrations',
  seederStorage: 'sequelize',
  seederStorageTableName: 'seeders',
  host: `${process.env.DB_HOST}`,
  dialect: 'mysql',
  logging: console.log,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  }
}
