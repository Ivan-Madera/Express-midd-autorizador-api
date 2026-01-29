import {
  type Attributes,
  type UpdateOptions,
  type Transaction
} from 'sequelize'
import User, {
  type UserInstance,
  type UserCreationAttributes
} from '../../database/models/User.model'

export const createUser = async (
  values: UserCreationAttributes,
  transaction?: Transaction
): Promise<UserInstance> => {
  return await User.create(values, {
    transaction
  })
}

export const updateUser = async (
  values: Partial<UserCreationAttributes>,
  options: UpdateOptions<Attributes<UserInstance>>
): Promise<number[]> => {
  return await User.update(values, options)
}
