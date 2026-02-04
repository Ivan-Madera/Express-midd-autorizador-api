import { NextFunction, Request, Response } from 'express'
import env from '../config/callEnv'
import { IJWTPayload } from '../entities/payload.entities'
import { validationErrors } from '../errors/validation.errors'
import { findNotRevokedSession } from '../repositories/queries/session.queries'
import { Codes } from '../utils/codeStatus'
import { ErrorException } from '../utils/Exceptions'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import { verify } from 'jsonwebtoken'

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
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
  } catch (error: unknown) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const methodValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
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
  } catch (error: unknown) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const contentTypeValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
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
  } catch (error: unknown) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const checkBearer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
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

    const payload = verify(token, secret, {
      issuer: 'auth.macropay.mx',
      audience: 'macropay.mx'
    }) as IJWTPayload

    const session = await findNotRevokedSession(payload.sid)
    if (!session) {
      status = Codes.unauthorized
      throw new ErrorException(
        validationErrors.INVALID_TOKEN,
        status,
        'The session was revoked or expired.'
      )
    }

    req.user_id = payload.uid
    req.session_id = payload.sid

    return next()
  } catch (error: unknown) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
