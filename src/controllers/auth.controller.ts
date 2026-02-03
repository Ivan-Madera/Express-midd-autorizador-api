import { Handler } from 'express'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import {
  loginService,
  logoutAllService,
  logoutService,
  refreshTokenService,
  registerService
} from '../services/auth.service'

export const login: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const {
      body: {
        data: { attributes }
      }
    } = req

    const ip = req.ip ?? null
    const userAgent = req.get('user-agent') ?? null

    const { email, password, device_id, device_type } = attributes

    const authResponse = await loginService(
      url,
      email,
      password,
      device_id,
      device_type,
      ip,
      userAgent
    )

    status = authResponse.status
    return res.status(status).json(authResponse.response)
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

    const userId = req.user_id as number
    const sessionId = req.session_id as number
    const ip = req.ip ?? null
    const userAgent = req.get('user-agent') ?? null

    const authResponse = await refreshTokenService(
      url,
      attributes.refresh_token,
      userId,
      sessionId,
      ip,
      userAgent
    )

    status = authResponse.status
    return res.status(status).json(authResponse.response)
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const logout: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const sessionId = req.session_id as number

    const authResponse = await logoutService(url, sessionId)

    status = authResponse.status
    return res.status(status).json(authResponse.response)
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}

export const logoutAll: Handler = async (req, res) => {
  const url = req.originalUrl
  let status = Codes.errorServer

  try {
    const userId = req.user_id as number

    const authResponse = await logoutAllService(url, userId)

    status = authResponse.status
    return res.status(status).json(authResponse.response)
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

    const authResponse = await registerService(url, email, password)

    status = authResponse.status
    return res.status(status).json(authResponse.response)
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
