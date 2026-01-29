import { configure, getLogger } from 'log4js'

configure({
  appenders: {
    stdout: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%[[%x{time}] - [%p] | %m %]',
        tokens: {
          time: () => {
            return new Date().toLocaleString('es-MX', { hour12: false })
          }
        }
      }
    }
  },
  categories: {
    default: {
      appenders: ['stdout'],
      level: 'debug'
    }
  }
})

const logger = getLogger('Logger')

export const LogMark = (message: string): void => {
  logger.mark(message)
}

export const LogInfo = (message: string): void => {
  logger.info(message)
}

export const LogError = (message: string): void => {
  logger.error(message)
}

export const MessageInfo = (
  service: string,
  version: string,
  message: string
): void => {
  logger.info(`[${service}] | [${version}] | ${message}`)
}

export const MessageWarn = (
  service: string,
  version: string,
  message: string
): void => {
  logger.warn(`[${service}] | [${version}] | ${message}`)
}

export const LogWarn = (service: string, version: string, error: any): void => {
  logger.warn(`[${service}] | [${version}] | ${error.message as string}`)
}
