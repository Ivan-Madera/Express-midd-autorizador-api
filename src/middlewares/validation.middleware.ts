import { validationResult } from 'express-validator'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseValidator } from '../utils/jsonApiResponses'

export const validateResult = (req: any, res: any, next: any): any => {
  const url = req.originalUrl
  const status = Codes.unprocessableContent

  try {
    validationResult(req).throw()
    return next()
  } catch (error: any) {
    const err = error.array().shift()
    const msg = `Invalid value in the ${err.path as string} of the ${
      err.location as string
    }`
    return res.status(status).json(JsonApiResponseValidator(url, msg))
  }
}
