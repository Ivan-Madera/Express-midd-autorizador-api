import { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import { validateResult } from '../middlewares/validation.middleware'

export const loginValidator = [
  body('data').notEmpty().isObject(),
  body('data.type').notEmpty().isString(),
  body('data.attributes').notEmpty().isObject(),
  body('data.attributes.email').notEmpty().isString(),
  body('data.attributes.password').notEmpty().isString(),
  body('data.attributes.device_id').notEmpty().isString(),
  body('data.attributes.device_type').notEmpty().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const refreshTokenValidator = [
  body('data').notEmpty().isObject(),
  body('data.type').notEmpty().isString(),
  body('data.attributes').notEmpty().isObject(),
  body('data.attributes.refresh_token').notEmpty().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const registerValidator = [
  body('data').notEmpty().isObject(),
  body('data.type').notEmpty().isString(),
  body('data.attributes').notEmpty().isObject(),
  body('data.attributes.email').notEmpty().isString(),
  body('data.attributes.password').notEmpty().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]
