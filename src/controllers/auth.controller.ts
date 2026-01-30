import { Handler } from 'express'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import { ErrorException } from '../utils/Exceptions'
import User from '../database/models/User.model'
import * as argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import {
  createAccessToken,
  createRefreshToken,
  hashToken
} from '../utils/tokens'
import Session from '../database/models/Session.model'

export const login: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const { email, password, device_id, device_type } = attributes

    const user = await User.findOne({ where: { email } })
    if (!user) {
      status = Codes.unauthorized
      throw new ErrorException(
        {
          code: 'AUTH-001',
          suggestions: 'Check the user credentials.',
          title: 'User not found.'
        },
        status,
        'The user was not found.'
      )
    }

    const ok = await argon2.verify(user.password_hash, password)
    if (!ok) {
      status = Codes.unauthorized
      throw new ErrorException(
        {
          code: 'AUTH-002',
          suggestions: 'Check the user credentials.',
          title: 'User not found.'
        },
        status,
        'The user was not found.'
      )
    }

    const sessionId = uuidv4()

    const accessToken = createAccessToken({
      uid: user.id,
      sid: sessionId
    })

    const refreshToken = createRefreshToken()
    const refreshHash = hashToken(refreshToken)

    await Session.create({
      user_id: user.id,
      refresh_token_hash: refreshHash,
      device_id,
      device_type,
      ip: req.ip as string,
      user_agent: req.get('user-agent') as string,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    status = Codes.success
    return res.status(status).json({ accessToken, refreshToken })
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const refreshToken: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const { refresh_token } = attributes

    const hash = hashToken(refresh_token)

    const session = await Session.findOne({ where: { refresh_token_hash: hash } })
    if (!session) {
      status = Codes.unauthorized
      throw new ErrorException(
        {
          code: 'AUTH-001',
          suggestions: 'Check the user credentials.',
          title: 'User not found.'
        },
        status,
        'The user was not found.'
      )
    }

    if (session.revoked_at || session.expires_at < new Date()) {
      status = Codes.unauthorized
      throw new ErrorException(
        {
          code: 'AUTH-001',
          suggestions: 'Check the user credentials.',
          title: 'User not found.'
        },
        status,
        'The user was not found.'
      )
    }

    await session.destroy()

    const newRefreshToken = createRefreshToken()
    const newRefreshHash = hashToken(newRefreshToken)

    await Session.create({
      user_id: session.user_id,
      refresh_token_hash: newRefreshHash,
      device_id: session.device_id,
      device_type: session.device_type,
      ip: req.ip ?? null,
      user_agent: req.get('user-agent') ?? null,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    const sessionId = uuidv4()

    const accessToken = createAccessToken({
      uid: session.user_id,
      sid: sessionId
    })

    status = Codes.success
    return res.status(status).json({ accessToken, refreshToken: newRefreshToken })
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const logout: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const { refresh_token } = attributes

    const hash = hashToken(refresh_token)

    await Session.destroy({ where: { refresh_token_hash: hash } })

    status = Codes.success
    return res.status(status).json({ message: 'User logged out successfully' })
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const logoutAll: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const user_id = req.user_id

    await Session.destroy({ where: { user_id } })

    status = Codes.success
    return res.status(status).json({ message: 'All sessions closed successfully' })
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const register: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const { email, password } = attributes

    const exists = await User.findOne({ where: { email } })
    if (exists) {
      status = Codes.unauthorized
      throw new ErrorException(
        {
          code: 'AUTH-003',
          suggestions: 'Change the email.',
          title: 'User already exists.'
        },
        status,
        'The user already exists.'
      )
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id
    })

    await User.create({ email, password_hash: passwordHash })

    status = Codes.success
    return res.status(status).json({ message: 'User registered successfully' })
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
