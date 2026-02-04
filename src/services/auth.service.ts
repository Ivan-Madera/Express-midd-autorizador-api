import { IJsonApiResponseGeneric } from '../entities/jsonApiResponses.entities'
import { authErrors } from '../errors/auth.errors'
import {
  createSession,
  updateSession
} from '../repositories/mutations/session.mutations'
import {
  createUser,
  updateUser
} from '../repositories/mutations/user.mutations'
import { findOneSession } from '../repositories/queries/session.queries'
import { findOneUser } from '../repositories/queries/user.queries'
import { Codes } from '../utils/codeStatus'
import { ErrorException } from '../utils/Exceptions'
import {
  JsonApiResponseData,
  JsonApiResponseError,
  JsonApiResponseGeneric,
  JsonApiResponseMessage
} from '../utils/jsonApiResponses'
import {
  createAccessToken,
  createRefreshToken,
  hashToken
} from '../utils/tokens'
import * as argon2 from 'argon2'

export const loginService = async (
  url: string,
  email: string,
  password: string,
  deviceId: string,
  deviceType: string,
  ip: string | null,
  userAgent: string | null
): Promise<IJsonApiResponseGeneric> => {
  let status = Codes.errorServer

  try {
    const user = await findOneUser(email)
    if (!user) {
      await new Promise((r) => setTimeout(r, 1000))
      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.INVALID_CREDENTIALS,
        status,
        'The user was not found.'
      )
    }

    const ok = await argon2.verify(user.password_hash, password)
    if (!ok) {
      await new Promise((r) => setTimeout(r, 800))
      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.INVALID_CREDENTIALS,
        status,
        'The password is not valid.'
      )
    }

    const refreshToken = createRefreshToken()
    const refreshHash = hashToken(refreshToken)

    const session = await createSession({
      user_id: user.id,
      refresh_token_hash: refreshHash,
      device_id: deviceId,
      device_type: deviceType,
      ip: ip,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    const accessToken = createAccessToken({
      uid: user.id,
      sid: session.id
    })

    await updateUser({ last_login: new Date() }, { where: { id: user.id } })

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseData('session', { accessToken, refreshToken }, url)
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}

export const refreshTokenService = async (
  url: string,
  refreshToken: string,
  ip: string | null,
  userAgent: string | null
): Promise<IJsonApiResponseGeneric> => {
  let status = Codes.errorServer

  try {
    const hash = hashToken(refreshToken)

    const session = await findOneSession(hash)
    if (!session) {
      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.INVALID_CREDENTIALS,
        status,
        'The token is not valid.'
      )
    }

    const now = new Date()

    if (session.revoked_at) {
      if (session.replaced_by) {
        await updateSession(
          { revoked_at: new Date() },
          { where: { user_id: session.user_id } }
        )

        status = Codes.unauthorized
        throw new ErrorException(
          authErrors.INVALID_CREDENTIALS,
          status,
          'Security alert: token reuse detected.'
        )
      }

      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.INVALID_CREDENTIALS,
        status,
        'The session was revoked.'
      )
    }

    if (session.expires_at <= now) {
      await updateSession({ revoked_at: now }, { where: { id: session.id } })

      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.INVALID_CREDENTIALS,
        status,
        'Session expired.'
      )
    }

    const newRefreshToken = createRefreshToken()
    const newRefreshHash = hashToken(newRefreshToken)

    const newSession = await createSession({
      user_id: session.user_id,
      refresh_token_hash: newRefreshHash,
      device_id: session.device_id,
      device_type: session.device_type,
      ip: ip,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    await updateSession(
      { revoked_at: now, replaced_by: newSession.id },
      { where: { id: session.id } }
    )

    const accessToken = createAccessToken({
      uid: session.user_id,
      sid: newSession.id
    })

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseData(
        'session',
        { accessToken, refreshToken: newRefreshToken },
        url
      )
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}

export const logoutService = async (
  url: string,
  sessionId: number
): Promise<IJsonApiResponseGeneric> => {
  let status = Codes.errorServer

  try {
    await updateSession(
      { revoked_at: new Date() },
      { where: { id: sessionId } }
    )

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseMessage('session', 'User logged out successfully', url)
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}

export const logoutAllService = async (
  url: string,
  userId: number
): Promise<IJsonApiResponseGeneric> => {
  let status = Codes.errorServer

  try {
    await updateSession(
      { revoked_at: new Date() },
      { where: { user_id: userId } }
    )

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseMessage(
        'session',
        'All sessions have been closed successfully.',
        url
      )
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}

export const registerService = async (
  url: string,
  email: string,
  password: string
): Promise<IJsonApiResponseGeneric> => {
  let status = Codes.errorServer

  try {
    const user = await findOneUser(email)
    if (user) {
      status = Codes.unauthorized
      throw new ErrorException(
        authErrors.ALREADY_EXISTS,
        status,
        'The user already exists.'
      )
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    })

    await createUser({ email, password_hash: passwordHash })

    status = Codes.success
    return JsonApiResponseGeneric(
      status,
      JsonApiResponseMessage('session', 'User registered successfully', url)
    )
  } catch (error) {
    return JsonApiResponseGeneric(status, JsonApiResponseError(error, url))
  }
}
