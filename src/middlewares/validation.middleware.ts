import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseValidator } from '../utils/jsonApiResponses'

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const url = req.originalUrl
  const status = Codes.unprocessableContent

  try {
    validationResult(req).throw()
    return next()
  } catch (error: unknown) {
    const err = (error as any).array().shift()
    const msg = `Invalid value in the ${err.path as string} of the ${
      err.location as string
    }`
    return res.status(status).json(JsonApiResponseValidator(url, msg))
  }
}
