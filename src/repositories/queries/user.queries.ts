import { type Attributes, type FindOptions } from 'sequelize'
import User, { type UserInstance } from '../../database/models/User.model'

export const findOneUser = async (
  usuario: string,
  attributes?: string[]
): Promise<UserInstance | null> => {
  return await User.findOne({
    where: {
      usuario
    },
    attributes
  })
}

export const findAllUsers = async (
  options?: FindOptions<Attributes<UserInstance>>
): Promise<UserInstance[]> => {
  return await User.findAll(options)
}
