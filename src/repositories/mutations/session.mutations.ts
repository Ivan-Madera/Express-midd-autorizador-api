import Session, {
  type SessionCreationAttributes,
  type SessionInstance
} from '../../database/models/Session.model'
import {
  type Attributes,
  type UpdateOptions,
  type Transaction,
  type DestroyOptions
} from 'sequelize'

export const createSession = async (
  values: SessionCreationAttributes,
  transaction?: Transaction
): Promise<SessionInstance> => {
  return await Session.create(values, {
    transaction
  })
}

export const updateSession = async (
  values: Partial<SessionCreationAttributes>,
  options: UpdateOptions<Attributes<SessionInstance>>
): Promise<number[]> => {
  return await Session.update(values, options)
}

export const destroySession = async (
  options: DestroyOptions<Attributes<SessionInstance>>
): Promise<number> => {
  return await Session.destroy(options)
}
