import User, { type UserInstance } from '../../database/models/User.model'

export const findOneUser = async (
  email: string,
  attributes?: string[]
): Promise<UserInstance | null> => {
  return await User.findOne({
    where: {
      email
    },
    attributes
  })
}
