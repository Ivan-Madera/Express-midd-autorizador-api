import env from '../config/callEnv'
import { validationErrors } from '../errors/validation.errors'
import { Codes } from '../utils/codeStatus'
import { ErrorException } from '../utils/Exceptions'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import { verify } from 'jsonwebtoken'

export const checkAuth = (req: any, res: any, next: any): any => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const token = req.get('token')

    if (token !== env.TOKEN) {
      status = Codes.unauthorized
      throw new ErrorException(
        validationErrors.INVALID_APPKEY,
        status,
        'The appkey is invalid or has expired.'
      )
    }

    return next()
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const methodValidator = (req: any, res: any, next: any): void => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const httpMethod = req.method

    if (httpMethod !== 'POST') {
      status = Codes.notAcceptable
      throw new ErrorException(
        validationErrors.HTTP_METHOD,
        status,
        'The HTTP method is not allowed for this endpoint, please check the request.'
      )
    }

    return next()
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const contentTypeValidator = (req: any, res: any, next: any): void => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const content = req.get('Content-Type')

    if (content !== 'application/vnd.api+json') {
      status = Codes.unsupportedMedia
      throw new ErrorException(
        validationErrors.CONTENT_TYPE,
        status,
        'Content-Type is not allowed for this endpoint, please check the request.'
      )
    }

    return next()
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const checkBearer = (req: any, res: any, next: any): any => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const auth = req.get('Authorization')
    const secret = env.SECRET_KEY

    if (!auth || !secret || !auth.startsWith('Bearer ')) {
      status = Codes.unauthorized
      throw new ErrorException(
        validationErrors.MISSING_BEARER,
        status,
        'The Authorization header is missing or does not start with Bearer.'
      )
    }

    const token = auth.slice(7)

    verify(token, secret, (error: any) => {
      if (error) {
        status = Codes.unauthorized
        throw new ErrorException(
          validationErrors.INVALID_TOKEN,
          status,
          'The token is invalid or has expired.'
        )
      }
    })

    return next()
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
