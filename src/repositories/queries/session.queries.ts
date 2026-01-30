import Session, { SessionInstance } from "../../database/models/Session.model"


export const findOneSession = async (
  refresh_token_hash: string,
  attributes?: string[]
): Promise<SessionInstance | null> => {
  return await Session.findOne({
    where: {
      refresh_token_hash
    },
    attributes
  })
}
