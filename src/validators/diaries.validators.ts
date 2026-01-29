import { body } from 'express-validator'
import { validateResult } from '../middlewares/validation.middleware'

export const diariesCreateValidator = [
  body('data').notEmpty().isObject(),
  body('data.type').notEmpty().isString(),
  body('data.attributes').notEmpty().isObject(),
  body('data.attributes.date').notEmpty().isString(),
  body('data.attributes.weather').notEmpty().isString(),
  body('data.attributes.visibility').notEmpty().isString(),
  body('data.attributes.comment').optional().isString(),
  (req: any, res: any, next: any) => {
    validateResult(req, res, next)
  }
]
