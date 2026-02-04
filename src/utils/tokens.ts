import jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import env from '../config/callEnv'

export const createAccessToken = (payload: any) => {
  return jwt.sign(payload, env.SECRET_KEY, {
    expiresIn: '15m',
    issuer: 'auth.macropay.mx',
    audience: 'macropay.mx'
  })
}

export const createRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex')
}

export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
